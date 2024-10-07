import express from "express";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../configs/mysql.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

// 新增註冊路由
router.post("/signup", async (req, res) => {
  console.log("--- Signup Route Start ---");
  try {
    const { email, user_name, password } = req.body;

    if (!email || !user_name || !password) {
      console.log("Missing required fields");
      return res.status(400).json({ status: "fail", message: "缺少必要欄位" });
    }

    // 檢查 email 是否已存在
    const [existingUsers] = await db.query(
      "SELECT * FROM user_info WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      console.log("Email already registered:", email);
      return res
        .status(400)
        .json({ status: "fail", message: "該 email 已被註冊" });
    }

    // 生成加鹽的密碼哈希
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 插入新用戶
    const [result] = await db.query(
      "INSERT INTO user_info (user_name, email, password, create_day) VALUES (?, ?, ?, ?)",
      [user_name, email, hashedPassword, new Date()]
    );

    if (result.affectedRows === 1) {
      console.log("User registered successfully:", email);
      res.status(201).json({ status: "success", message: "註冊成功" });
    } else {
      console.log("User registration failed");
      res
        .status(500)
        .json({ status: "error", message: "註冊失敗，請稍後再試" });
    }
  } catch (error) {
    console.error("註冊錯誤:", error);
    res.status(500).json({ status: "error", message: "發生錯誤，請稍後再試" });
  } finally {
    console.log("--- Signup Route End ---");
  }
});

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
  console.log("--- Login Route Start ---");
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing required fields");
      return res.status(400).json({ status: "fail", message: "缺少必要欄位" });
    }

    // 查詢資料庫
    const [rows] = await db.query(
      "SELECT * FROM user_info WHERE email=? LIMIT 1",
      [email]
    );

    const user = rows[0]; // 只取第一筆資料

    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ status: "error", message: "使用者不存在" });
    }

    // 使用 bcrypt 來比較密碼
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      console.log("Invalid password for user:", email);
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
      { expiresIn: "1d" } // 設置為 1 天
    );

    // 設定 httpOnly cookie 來儲存 access token
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 天
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", // 在生產環境中使用 HTTPS
    });

    console.log("Login successful for user:", email);
    console.log("Token generated and set in cookie");

    // 傳送 access token 作為回應
    res.json({
      status: "success",
      data: { accessToken },
    });
  } catch (error) {
    console.error("伺服器錯誤:", error);
    res.status(500).json({ status: "error", message: "伺服器錯誤" });
  } finally {
    console.log("--- Login Route End ---");
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
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    console.log("Logout successful, cookie cleared");

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
