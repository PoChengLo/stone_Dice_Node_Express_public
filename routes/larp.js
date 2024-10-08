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

// 回傳訂單資料
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
      // console.log(
      //   `Comparing: ${v.ord_theme.toString()} === ${data.larpName}, ${v.ord_loc.toString()} === ${data.loc}, ${v.ord_date} === ${data.date}, ${v.ord_time} === ${data.datetime}`
      // );
      return (
        v.ord_theme.toString() === data.larpName && // 先比對 larpName
        v.ord_loc.toString() === data.loc && // 如果 larpName 相同，接著比對 loc
        v.ord_date === data.date && // 如果 loc 相同，再比對 date
        v.ord_time === data.datetime // 如果 date 相同，最後比對 time
      );
    });
    console.log("Is Booked:", isBooked);

    if (isBooked === false) {
      const [row, fields] = await db.query(
        `INSERT INTO larp_ord_list 
      (ord_theme, ord_loc, ord_people, ord_date, ord_time, ord_name, ord_mobile, ord_email, ord_total, place_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        ]
      );

      res.json({ success: true, message: "後端資料儲存成功!" });
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

// 可查看訂單回丟得到的json檔，寫完後要砍掉這隻
router.get("/ord-api", async (req, res) => {
  try {
    const [rows, fields] = await db.query(`SELECT * FROM larp_ord_list`);
    res.json(rows); // Return the fetched data as JSON
  } catch (error) {
    console.error("資料獲取失敗:", error);
    res
      .status(500)
      .json({ success: false, message: "後端資料獲取失敗", error });
  }
});

// 處理被預約的時間
router.get("/orded-time", async (req, res) => {
  const { larpName, loc, date, datetime } = req.body;
  console.log("查詢條件:", { larpName, loc, date, datetime });

  try {
    // 查詢當前條件下，已經被預約的時段
    const [orded] = await db.query(
      `SELECT ord_time FROM larp_ord_list WHERE ord_theme = ? AND ord_loc = ? AND ord_date = ?`,
      [larpName, loc, date]
    );

    // 提取已預約的時段
    const ordedTime = orded.map((ord) => ord.ord_time);

    // 把已被預約的時段傳給前端
    res.status(200).json({ ordedTime });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "伺服器錯誤，請稍後再試。" });
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
  res.json({ single: row, all: rows });
});

export default router;
