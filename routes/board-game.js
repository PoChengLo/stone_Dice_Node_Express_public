import express from "express";
import db from "../configs/mysql.js";

const router = express.Router();

// 路由處理器
router.get("/", async (req, res) => {
  // 分頁 (查詢字串qs: page=2&perpage=5) (目前第page頁，每頁perpage筆資料)
  // 公式: limit = perpage
  //      offset = (page-1) * perpage
  const page = Number(req.query.page) || 1; // page 預設為 1
  const perpage = Number(req.query.perpage) || 8; // perpage 預設為 10
  const limit = perpage;
  const offset = (page - 1) * perpage;

  const sql = `SELECT * FROM prod_list LIMIT ${limit} OFFSET ${offset}`;
  const [rows] = await db.query(sql);

  // 進行分頁時，額外執行sql在此條件下總共多少筆資料
  const [rows2] = await db.query(`SELECT COUNT(*) AS count FROM prod_list`);
  const { count } = rows2[0];
  // 計算總頁數
  const pageCount = Math.ceil(count / perpage);

  // rows 讀取的資料
  res.json({
    status: "success",
    data: {
      total: count, //總筆數
      pageCount, // 總頁數
      page, // 目前頁
      perpage, // 每筆頁數
      rows,
    },
  });
});

router.get("/:id", async (req, res) => {
  // 轉為數字
  const id = Number(req.params.id);
  const sql = "SELECT * FROM prod_list WHERE id = ?";

  try {
    // 使用動態路由
    const [row] = await db.query(sql, [id]);
    return res.json({ status: "success", data: { row } });
  } catch (error) {
    res.status(500).json({ error: "Database query error" });
  }
});

export default router;
