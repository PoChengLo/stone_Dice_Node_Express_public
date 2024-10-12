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
  WHERE ll.larp_type = 0
  `;

  const [rows] = await db.query(sql);
  // rows 讀取的資料
  res.json(rows);
});

router.get("/:mystreyid", async (req, res) => {
  const { mystreyid } = req.params;
  const sql = `SELECT * ,
    (SELECT JSON_ARRAYAGG
            ( JSON_OBJECT
              ('actor_id', actor_list.actor_id,
              'actor', actor_list.actor,
              'actor_job', actor_list.actor_job,
              'actor_img', actor_list.actor_img,
              'actor_intro', actor_list.actor_intro
              )) 
      FROM actor_list WHERE actor_list.id = larp_list.id) AS actor_list
    FROM larp_list
    WHERE larp_type=0 AND id=?`;
  const [row] = await db.query(sql, [mystreyid]);

  const sql2 = `
    SELECT *
    FROM larp_list ll
    JOIN larp_loc lc ON ll.id = lc.id
    JOIN loc_list ls ON lc.loc_id = ls.loc_id
    WHERE ll.larp_type = 0
    `;
  const [rows] = await db.query(sql2);

  // const actor =
  //   "SELECT * FROM larp_list ll JOIN actor_list actor ON actor.id = ll.id WHERE larp_type=0 AND id=?";

  // const [actrow] = await db.query(actor);

  // 把被預約的時間傳給前端，讓前端可以動態調整選項選取
  // const sql3 = `SELECT ord_theme, ord_loc, ord_date, ord_time FROM larp_ord_list `;
  // const [ord] = await db.query(sql3);
  // console.log(ord);
  res.json({ single: row, all: rows });
});

export default router;
