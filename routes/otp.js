import express from "express";
import db from "../configs/mysql.js";
import bcrypt from "bcrypt";
import transporter from "../configs/mail.js";
import "dotenv/config.js";

const router = express.Router();

// 生成 OTP 的函數
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 電子郵件文字訊息樣版
const mailText = (otpToken) => `親愛的網站會員 您好，
通知重設密碼所需要的驗証碼，
請輸入以下的6位數字，重設密碼頁面的"電子郵件驗証碼"欄位中。
請注意驗証碼將於寄送後30分鐘後到期，如有任何問題請洽網站客服人員:
    
${otpToken}
    
敬上

台灣 NextJS Inc. 網站`;

// 請求 OTP 的路由
router.post("/request-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ status: "error", message: "缺少必要資料" });
  }

  try {
    // 檢查用戶是否存在
    const [user] = await db.query("SELECT * FROM user_info WHERE email = ?", [
      email,
    ]);

    if (user.length === 0) {
      return res.status(404).json({ status: "error", message: "使用者不存在" });
    }

    // 生成 OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 分鐘後過期

    // 將 OTP 存儲到數據庫
    await db.query(
      "INSERT INTO otp_tokens (email, token, created_at) VALUES (?, ?, ?)",
      [email, otp, new Date()]
    );

    // 寄送 email
    const mailOptions = {
      from: `"support"<${process.env.SMTP_TO_EMAIL}>`,
      to: email,
      subject: "重設密碼要求的電子郵件驗証碼",
      text: mailText(otp),
    };

    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error("發送電子郵件失敗:", err);
        return res
          .status(500)
          .json({ status: "error", message: "發送電子郵件失敗" });
      } else {
        return res.json({
          status: "success",
          message: "OTP 已發送至您的電子郵件",
        });
      }
    });
  } catch (error) {
    console.error("請求 OTP 錯誤:", error);
    res
      .status(500)
      .json({ status: "error", message: "伺服器錯誤，請稍後再試" });
  }
});

// 驗證 OTP 並重設密碼的路由
router.post("/reset-password", async (req, res) => {
  const { email, token, newPassword } = req.body;

  if (!email || !token || !newPassword) {
    return res.status(400).json({ status: "error", message: "缺少必要資料" });
  }

  try {
    // 檢查 OTP 是否有效
    const [otp] = await db.query(
      "SELECT * FROM otp_tokens WHERE email = ? AND token = ? AND created_at > DATE_SUB(NOW(), INTERVAL 30 MINUTE)",
      [email, token]
    );

    if (otp.length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "OTP 無效或已過期" });
    }

    // 更新密碼
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE user_info SET password = ? WHERE email = ?", [
      hashedPassword,
      email,
    ]);

    // 刪除已使用的 OTP
    await db.query("DELETE FROM otp_tokens WHERE email = ?", [email]);

    res.json({ status: "success", message: "密碼重置成功" });
  } catch (error) {
    console.error("重置密碼錯誤:", error);
    res
      .status(500)
      .json({ status: "error", message: "伺服器錯誤，請稍後再試" });
  }
});

export default router;
