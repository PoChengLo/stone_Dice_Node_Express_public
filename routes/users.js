import express from "express";
import db from "../configs/mysql.js";
import authenticate from "@/middlewares/authenticate.js"; // 用於授權驗證
import { getIdParam } from "#db-helpers/db-tool.js"; // 用於將參數轉換為數字

// 上傳檔案用使用multer
import path from "path";
import multer from "multer";

const router = express.Router();

// multer 設定值 - START
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "public/avatar/");
  },
  filename: function (req, file, callback) {
    const newFilename = req.user.id;
    callback(null, newFilename + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
// multer 設定值 - END

// GET - 取得所有會員資料
router.get("/", async function (req, res) {
  try {
    const [users] = await db.query("SELECT * FROM user_info");

    if (users.length === 0) {
      return res.json({ status: "error", message: "沒有找到會員資料" });
    }

    return res.json({ status: "success", data: { users } });
  } catch (error) {
    console.error("資料庫查詢錯誤:", error);
    return res.status(500).json({ status: "error", message: "伺服器錯誤" });
  }
});

// GET - 取得單筆會員資料
router.get("/:id", authenticate, async function (req, res) {
  const id = getIdParam(req);

  if (req.user.id !== id) {
    return res.json({ status: "error", message: "存取會員資料失敗" });
  }

  try {
    const [userRows] = await db.query(
      "SELECT * FROM user_info WHERE user_id = ?",
      [id]
    );

    if (userRows.length === 0) {
      return res.json({ status: "error", message: "找不到該會員" });
    }

    const user = userRows[0];

    delete user.password;

    return res.json({ status: "success", data: { user } });
  } catch (error) {
    console.error("資料庫查詢錯誤:", error);
    return res.status(500).json({ status: "error", message: "伺服器錯誤" });
  }
});

export default router;
