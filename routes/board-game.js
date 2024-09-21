import express from "express";
import db from "../configs/mysql.js";

const router = express.Router();

// 路由處理器
router.get("/", async (req, res) => {
  const sql = "SELECT * FROM prod_list ";
  const [rows] = await db.query(sql);
  // rows 讀取的資料
  res.json(rows);
});

router.get("/:prod_id", async (req, res) => {
  // 提取請求中的路由，設置為變數
  const { prod_id } = req.params;
  const sql = "SELECT * FROM prod_list WHERE prod_id = ?";

  try {
    // 使用動態路由
    const [row] = await db.query(sql, [prod_id]);
    res.json(row);
  } catch (error) {
    res.status(500).json({ error: "Database query error" });
  }
});

export default router;
