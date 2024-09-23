import express from "express";
import db from "../configs/mysql.js";

const router = express.Router();
// 路由處理器

router.get("/:larpid", async (req, res) => {
  const { larpid } = req.params;

  const sql = "SELECT * FROM larp_list WHERE larp_type=1 AND id=?";
  const [rows] = await db.query(sql, [larpid]);
  // rows 讀取的資料
  res.json(rows);
});

router.get("/", async (req, res) => {
  const sql = `SELECT *
  FROM larp_list ll
  JOIN larp_loc lc ON ll.id = lc.id
  WHERE ll.larp_type = 1
  `;
  // const sql = `SELECT ll.larp_id, ll.larp_img, ll.larp_name, ll.larp_price
  // FROM larp_list ll
  // JOIN larp_loc lc ON ll.larp_id = lc.larp_id
  // WHERE ll.larp_type = 1`;

  // if (loc > 0) {
  //   sql += `AND lc.loc_id = ?`;
  // }
  // sql += `GROUP BY ll.larp_id`;

  const [rows] = await db.query(sql);
  // rows 讀取的資料
  res.json(rows);
});

export default router;
