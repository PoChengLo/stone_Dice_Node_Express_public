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

// 回傳訂單資料(由後端對比資料庫判斷，如果繞過前端驗證也會在這邊被擋下來)
router.post("/ord-api", async (req, res) => {
  const data = req.body;
  // 改變資料格式
  const loc = parseInt(data.loc);
  const people = parseInt(data.people);

  // 拿到預約訂單資料
  const sql = `SELECT * FROM larp_ord_list`;

  try {
    const [booking] = await db.query(sql);

    // 檢查目前的選項是否已經被預約
    const isBooked = booking.some((v) => {
      return (
        v.ord_theme.toString() === data.larpName && // 先比對 larpName
        v.ord_loc.toString() === data.loc && // 如果 larpName 相同，接著比對 loc
        v.ord_date === data.date && // 如果 loc 相同，再比對 date
        v.ord_time === data.datetime // 如果 date 相同，最後比對 time
      );
    });
    // console.log("Is Booked:", isBooked);

    if (isBooked === false) {
      const [result] = await db.query(
        `INSERT INTO larp_ord_list 
      (ord_theme, ord_loc, ord_people, ord_date, ord_time, ord_name, ord_mobile, ord_email, ord_total, place_time,user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.larpName,
          loc,
          people,
          data.date,
          data.datetime,
          data.name,
          data.mobile,
          data.email,
          data.totalprice,
          data.ordTime,
          data.userid,
        ]
      );
      const ord_id = result.insertId;
      // console.log("新生成的ord_id:", ord_id);

      if (ord_id) {
        res.json({
          success: true,
          message: "後端資料儲存成功!",
          ord_id: ord_id,
        });
      } else {
        console.error("ord_id 為 undefined，可能插入失敗。");
        res
          .status(500)
          .json({ success: false, message: "ord_id 為 undefined。" });
      }
    } else {
      res.status(500).json({ success: false, message: "此時段已被預約!" });
    }
  } catch (error) {
    console.error("資料儲存失敗:", error);
    res
      .status(500)
      .json({ success: false, message: "後端資料儲存失敗", error });
  }
});

router.get("/check-success/:ord_id", async (req, res) => {
  const { ord_id } = req.params;

  try {
    const sql = "SELECT * FROM larp_ord_list WHERE ord_id = ?";
    const [rows] = await db.query(sql, [ord_id]);

    // 確保找到了訂單
    if (rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(rows[0]); // 返回找到的第一個訂單資料
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: "伺服器連線失敗" });
  }
});

router.get("/userid/:userid", async (req, res) => {
  try {
    const { userid } = req.params;
    const sql = `SELECT * FROM larp_ord_list WHERE user_id = ${userid}`;
    const [row] = await db.query(sql);
    res.status(200).json(row);
  } catch (error) {
    res.status(500).json({ message: "伺服器連線失敗" });
  }
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

  // 把被預約的時間傳給前端，讓前端可以動態調整選項選取
  const sql3 = `SELECT ord_theme, ord_loc, ord_date, ord_time FROM larp_ord_list `;
  const [ord] = await db.query(sql3);
  // console.log(ord);
  res.json({ single: row, all: rows, order: ord });
});

export default router;
