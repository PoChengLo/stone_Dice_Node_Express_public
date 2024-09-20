import express from "express";
import db from "../configs/mysql.js";

const router = express.Router();
// 路由處理器

router.get("/:larpid", async (req, res) => {
  const { larpid } = req.params;

  const sql = "SELECT * FROM larp_list WHERE larp_type=1 AND larp_id=?";
  const [rows] = await db.query(sql, [larpid]);
  // rows 讀取的資料
  res.json(rows);
});

router.get("/", async (req, res) => {
  const sql = "SELECT * FROM larp_list WHERE larp_type=1";
  const [rows] = await db.query(sql);
  // rows 讀取的資料
  if (rows.length === 0) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(rows);
});

export default router;
