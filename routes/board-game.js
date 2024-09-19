import express from "express";
import db from "../configs/mysql.js";

const router = express.Router();

// 路由處理器
router.get("/", (req, res) => {
  res.json({
    params: req.params,
    url: req.url,
    baseUrl: req.baseUrl,
    originalUrl: req.originalUrl,
  });
});

router.get("/category/1", async (req, res) => {
  const sql = "SELECT * FROM prod_list ";
  const [rows] = await db.query(sql);
  // rows 讀取的資料
  res.json(rows);
});

export default router;
