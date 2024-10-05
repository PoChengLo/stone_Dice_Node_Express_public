import express from "express";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../configs/mysql.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

// 檢查登入狀態用
router.get("/check", authenticate, async (req, res) => {
  console.log("--- /user-profile/check Route Start ---");
  try {
    console.log("User ID from token:", req.user.id);
    const [user] = await db.query("SELECT * FROM user_info WHERE user_id = ?", [
      req.user.id,
    ]);

    if (!user) {
      console.log("User not found in database");
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    console.log("User found:", JSON.stringify(user, null, 2));
    delete user.password;
    console.log("Sending response");
    return res.json({ status: "success", data: { user } });
  } catch (error) {
    console.error("Error in /check route:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Database query failed" });
  } finally {
    console.log("--- /user-profile/check Route End ---");
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
      { expiresIn: "3d" }
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

// 動態路由處理
router.get("/:id/home", async (req, res) => {
  const userId = req.params.id;
  try {
    const [user] = await db.query("SELECT * FROM user_info WHERE user_id = ?", [
      userId,
    ]);

    if (user.length > 0) {
      res.json({ status: "success", data: { user: user[0] } });
    } else {
      res.status(404).json({ status: "fail", message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: "Database error" });
  }
});

// 登出
router.post("/logout", authenticate, (req, res) => {
  try {
    // 清除 cookie，注意配置要和設置時一致
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // 或 'strict'，根據你的需求
      // 如果有設定 domain，也要加上
      // domain: 'your-domain.com'
    });

    // 只發送一次回應
    return res.status(200).json({
      status: "success",
      message: "已成功登出",
    });
  } catch (error) {
    console.error("登出錯誤:", error);
    return res.status(500).json({
      status: "error",
      message: "登出失敗",
    });
  }
});

export default router;
