import express from "express";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../configs/mysql.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

// 檢查登入狀態用
router.get("/check", authenticate, async (req, res) => {
  try {
    const [user] = await db.query("SELECT * FROM user_info WHERE user_id = ?", [
      req.user.id,
    ]);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    // 不回傳密碼值
    delete user.password;

    return res.json({ status: "success", data: { user } });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Database query failed" });
  }
});

// 偉大的登入
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: "fail", message: "缺少必要欄位" });
    }

    // 查詢資料庫
    const [rows] = await db.query(
      "SELECT * FROM user_info WHERE email=? LIMIT 1",
      [email]
    );

    const user = rows[0]; // 只取第一筆資料

    if (!user) {
      return res.status(404).json({ status: "error", message: "使用者不存在" });
    }

    // 使用 bcrypt 來比較密碼
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ status: "error", message: "密碼錯誤" });
    }

    // 生成存取令牌 (access token)，只包含必要的會員資料
    const returnUser = {
      id: user.user_id,
      username: user.user_name,
      email: user.email,
      google_uid: user.google_uid,
      line_uid: user.line_uid,
    };

    // 產生存取令牌
    const accessToken = jsonwebtoken.sign(
      returnUser,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "3d",
      }
    );

    // 設定 httpOnly cookie 來儲存 access token
    res.cookie("accessToken", accessToken, { httpOnly: true });

    // 傳送 access token 作為回應
    res.json({
      status: "success",
      data: { accessToken },
    });
  } catch (error) {
    console.error("伺服器錯誤:", error);
    res.status(500).json({ status: "error", message: "伺服器錯誤" });
  }
});

// 登出
router.post("/logout", authenticate, (req, res) => {
  // 清除cookie
  res.clearCookie("accessToken", { httpOnly: true });
  res.json({ status: "success", data: null });
});

export default router;
