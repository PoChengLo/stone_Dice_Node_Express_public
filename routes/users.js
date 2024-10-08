import express from "express";
import db from "../configs/mysql.js";
import authenticate from "../middlewares/authenticate.js"; // 用於授權驗證
import { getIdParam } from "../db-helpers/db-tool.js"; // 用於將參數轉換為數字
import path from "path";
import multer from "multer";

const router = express.Router();

// multer 設定 - 設置上傳目錄和檔案名稱
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "public/avatar/"); // 上傳的檔案將儲存到 'public/avatar/' 目錄
  },
  filename: function (req, file, callback) {
    const newFilename = req.user.id + path.extname(file.originalname); // 使用 user_id 作為檔案名稱
    callback(null, newFilename);
  },
});

// 設置 upload 中間件
const upload = multer({ storage: storage });

// 將 upload 中間件導出，供其他檔案使用
export { upload };

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
  // 轉為數字
  const id = getIdParam(req);

  // 檢查是否為授權會員，只有授權會員可以存取自己的資料
  if (req.user.id !== id) {
    return res.json({ status: "error", message: "存取會員資料失敗" });
  }

  try {
    const user = await User.findByPk(id, {
      raw: true, // 只需要資料表中資料
    });

    if (!user) {
      return res.json({ status: "error", message: "使用者不存在" });
    }

    // 不回傳密碼
    delete user.password;

    // 成功回傳資料
    return res.json({ status: "success", data: { user } });
  } catch (error) {
    console.error("資料庫錯誤:", error);
    return res
      .status(500)
      .json({ status: "error", message: "伺服器錯誤，請稍後再試" });
  }
});

export default router;
