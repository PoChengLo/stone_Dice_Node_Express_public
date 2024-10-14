import express from "express";
import { generateAndStoreToken, verifyToken } from "../configs/otp.js";
import { sendOTPEmail } from "../configs/emailService.js";
import db from "../configs/mysql.js";
import bcrypt from "bcrypt";
import "dotenv/config.js";

const router = express.Router();

// 電子郵件文字訊息樣版
const mailText = (otpToken) => `親愛的網站會員 您好，
通知重設密碼所需要的驗証碼，
請輸入以下的6位數字，重設密碼頁面的"電子郵件驗証碼"欄位中。
請注意驗証碼將於寄送後3分鐘後到期，如有任何問題請洽網站客服人員:
    
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
    // 檢查使用者 email 是否存在
    const [users] = await db.query("SELECT * FROM user_info WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "使用者帳號不存在" });
    }

    // 生成並儲存 OTP
    const otp = await generateAndStoreToken(email);

    // 使用 sendOTPEmail 發送 OTP 郵件
    const result = await sendOTPEmail(email, otp);

    if (result.success) {
      return res.json({
        status: "success",
        message: "OTP 已發送至您的電子郵件",
      });
    } else {
      console.error("發送電子郵件失敗:", result.error);
      return res
        .status(500)
        .json({ status: "error", message: "發送電子郵件失敗" });
    }
  } catch (error) {
    console.error("請求 OTP 錯誤:", error);
    res
      .status(500)
      .json({ status: "error", message: "伺服器錯誤，請稍後再試" });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { email, token } = req.body;

  if (!email || !token) {
    return res.status(400).json({ status: "error", message: "缺少必要資料" });
  }

  try {
    const isValid = await verifyToken(email, token);
    if (isValid) {
      res.json({ status: "success", message: "OTP 驗證成功" });
    } else {
      res.status(400).json({ status: "error", message: "OTP 無效或已過期" });
    }
  } catch (error) {
    console.error("驗證 OTP 時出錯:", error);
    res
      .status(500)
      .json({ status: "error", message: "伺服器錯誤，請稍後再試" });
  }
});

// 重設密碼的路由
router.put("/reset-password", async (req, res) => {
  const { email, token, newPassword } = req.body;

  if (!email || !token || !newPassword) {
    return res.status(400).json({ status: "error", message: "缺少必要資料" });
  }

  try {
    // 驗證 OTP
    const isValid = await verifyToken(email, token);

    if (!isValid) {
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
