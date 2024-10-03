import express from "express";
import db from "../configs/mysql.js";

const router = express.Router();
// 路由處理器
router.get("/", async (req, res) => {
  const sql = `SELECT *
  FROM larp_list ll
  JOIN larp_loc lc ON ll.id = lc.id
  JOIN larp_tag lt ON ll.id = lt.id
  JOIN tag_list tl ON tl.tag_id=lt.tag_id
  WHERE ll.larp_type = 1
  `;

  const [rows] = await db.query(sql);
  // rows 讀取的資料
  res.json(rows);
});

router.get("/check-page", async (req, res) => {
  const sql = "SELECT * FROM larp_list WHERE larp_type=1";
  const [rows] = await db.query(sql);

  const sql2 = "SELECT * FROM loc_list";
  const [locs] = await db.query(sql2);

  res.json({ escape: rows, location: locs });
});

router.get("/:larpid", async (req, res) => {
  const { larpid } = req.params;
  const sql = "SELECT * FROM larp_list WHERE larp_type=1 AND id=?";
  const [row] = await db.query(sql, [larpid]);

  const sql2 = `
  SELECT *
  FROM larp_list ll
  JOIN larp_loc lc ON ll.id = lc.id
  JOIN loc_list ls ON lc.loc_id = ls.loc_id
  JOIN larp_tag lt ON ll.id = lt.id
  JOIN tag_list tl ON tl.tag_id=lt.tag_id
  WHERE ll.larp_type = 1
  `;
  const [rows] = await db.query(sql2);
  res.json({ single: row, all: rows });
});

export default router;
