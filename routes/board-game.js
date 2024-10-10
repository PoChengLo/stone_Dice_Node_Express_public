import express from "express";
import db from "../configs/mysql.js";

const router = express.Router();

// 路由處理器
// 桌遊商品列表頁路由
router.get("/", async (req, res) => {
  // where條件 ---- START
  const conditions = [];
  const search = [];

  // 關鍵字 (查詢字串qs: prod_name_like='%${prod_name_like}%')
  const prod_name_like = req.query.prod_name_like || "";
  if (prod_name_like)
    search.push(`prod_name LIKE ${db.escape("%" + prod_name_like + "%")} `);
  const prod_desc_like = req.query.prod_desc_like || "";
  if (prod_desc_like)
    search.push(`prod_desc LIKE ${db.escape("%" + prod_desc_like + "%")} `);
  const prod_intro_like = req.query.prod_intro_like || "";
  if (prod_intro_like)
    search.push(`prod_intro LIKE ${db.escape("%" + prod_intro_like + "%")} `);
  const prod_rules_like = req.query.prod_rules_like || "";
  if (prod_rules_like)
    search.push(`prod_rules LIKE ${db.escape("%" + prod_rules_like + "%")} `);

  const search_key =
    search.length > 0 ? search.map((v) => ` ${v} `).join(` OR `) : "";

  // 如果 search_keys 存在，將其加入條件中
  if (search_key) {
    conditions[0] = `${search_key}`;
  }

  // 價格, 1100~2800 (查詢字串QS: price_min=1100&price_max=2800)
  const price_min = Number(req.query.price_min) || 1100; // 最小價格
  const price_max = Number(req.query.price_max) || 2800; // 最大價格
  conditions[1] = `price BETWEEN ${price_min} AND ${price_max}`;

  // 以下開始組合where從句
  // 1. 過濾有空白條件情況
  const search_condition = conditions.filter((v) => v);
  // 2. 用AND來串接所有條件(注意csv中如果是空陣列時不要套用where)
  const where =
    search_condition.length > 0
      ? "WHERE " + search_condition.map((v) => `( ${v} )`).join(` AND `)
      : "";

  // where條件 ---- END

  // let orderBy2 = "";
  // const orderby = req.query.orderby;
  // switch (orderby) {
  //   case "id_asc":
  //     orderBy2 = " ORDER BY id ASC";
  //     break;
  //   case "id_desc":
  //     orderBy2 = " ORDER BY id DESC";
  //     break;
  // }
  // 排序，例如價格由低到高 (查詢字串qs: sort=price&order=asc) (順向asc，逆向desc)
  const sort = req.query.sort || "id"; // 預設的排序資料表欄位
  const order = req.query.order || "ASC"; //預設使用順向 asc (1234..)
  // 建立sql從句字串
  const orderBy = `ORDER BY ${sort} ${order}`;

  // 分頁 (查詢字串qs: page=2&perpage=5) (目前第page頁，每頁perpage筆資料)
  // 公式: limit = perpage
  //      offset = (page-1) * perpage
  const page = Number(req.query.page) || 1; // page 預設為 1
  const perpage = Number(req.query.perpage) || 8; // perpage 預設為 10
  const limit = perpage;
  const offset = (page - 1) * perpage;

  const sql = `SELECT * FROM prod_list ${where} ${orderBy} LIMIT ${limit} OFFSET ${offset}`;

  const [rows] = await db.query(sql);

  // 進行分頁時，額外執行sql在此條件下總共多少筆資料
  const [rows2] = await db.query(
    `SELECT COUNT(*) AS count FROM prod_list ${where} ${orderBy}`
  );

  const { count } = rows2[0];
  // 計算總頁數
  const pageCount = Math.ceil(count / perpage);

  // 回傳的的資料，使用json格式
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

// 桌遊使用者資料頁面
router.get("/user-info", async (req, res) => {
  const user_id = Number(req.query.user_id);
  const sql = `SELECT user_id, user_name, mobile, real_name FROM user_info WHERE user_id = ${user_id}`;
  try {
    const [user] = await db.query(sql, [user_id]);
    res.json({ status: "success", data: { user } });
  } catch (error) {
    res.status(500).json({ error: "Database query error" });
  }
});

router.get("/pay-ship", async (req, res) => {
  const user_id = Number(req.query.user_id);
  const sql = `SELECT * FROM recipient_info WHERE user_id = ${user_id}`;

  try {
    const [recipient] = await db.query(sql, [user_id]);
    res.json({ status: "success", data: { recipient } });
  } catch (error) {
    res.status(500).json({ error: "Database query error" });
  }
});

router.post("/pay-ship", async (req, res) => {
  let new_ord, new_ord_list_id, new_ord_item;
  const orderData = req.body;
  const user_id = Number(req.query.user_id);
  // 購物車資料
  const cart_data = orderData.items;
  // 收件人資料
  const recipient_data = orderData.selectRecipient;
  // 訂單總額
  const final_total = orderData.finalTotal;

  // 新增訂單
  try {
    const new_ord_sql = `INSERT INTO prod_ord_list (user_id, ord_total, ord_pay, ord_recipient_name, ord_contact_number, ord_contact_address) VALUES (?, ?, ?, ?, ?, ?)`;
    const [newOrd, new_ord_data] = await db.query(new_ord_sql, [
      `${user_id}`,
      `${final_total}`,
      0,
      `${recipient_data.recipient}`,
      `${recipient_data.contact_number}`,
      `${recipient_data.address}`,
    ]);
    new_ord = newOrd;
    console.log("新增訂單");
  } catch (e) {
    console.log("無法新增訂單");
  }

  // 新增訂單項目
  try {
    new_ord_list_id = new_ord.insertId;
    const new_cart_item_sql = `INSERT INTO prod_ord_item (ord_id, id, prod_name, item_price, item_qty, item_total ) VALUES(?, ?, ?, ?, ?, ?)`;
    const new_ord_item_sql = `SELECT * FROM prod_ord_item WHERE ord_id = ${new_ord_list_id}`;
    for (const cart_item of cart_data) {
      await db.query(new_cart_item_sql, [
        `${new_ord_list_id}`,
        cart_item.id,
        cart_item.prod_name,
        cart_item.price,
        cart_item.quantity,
        cart_item.subtotal,
      ]);
    }
    console.log("新增訂單項目");
    [new_ord_item] = await db.query(new_ord_item_sql);
  } catch (e) {
    console.log("無法新增訂單項目");
  }

  // 如果有新增訂單，返回成功儲存訂單
  if (new_ord && new_ord_item) {
    res.json({
      success: true,
      message: "訂單儲存成功！！！",
      new_ord,
      new_ord_list_id,
      new_ord_item,
      orderData,
    });
  } else {
    res.json({ success: false, message: "請檢查會員id" });
  }
});

router.get("/success", async (req, res) => {
  let new_ord, new_ord_list_id, new_ord_item;
  const user_id = Number(req.query.user_id);
  const new_ord_sql = `SELECT * FROM prod_ord_list WHERE user_id = ${user_id} ORDER BY ord_date DESC LIMIT 1`;
  try {
    const [newOrd] = await db.query(new_ord_sql, [user_id]);
    new_ord = newOrd;
  } catch (e) {
    console.log(e);
  }
  new_ord_list_id = new_ord[0].ord_id;
  const new_ord_item_sql = `SELECT * FROM prod_ord_item WHERE ord_id = ${new_ord_list_id}`;

  try {
    const [newOrdItem] = await db.query(new_ord_item_sql, [new_ord_list_id]);
    new_ord_item = newOrdItem;
  } catch (e) {
    console.log(e);
  }

  res.json({
    success: true,
    new_ord,
    new_ord_item,
  });
});

// 商品單獨頁路由
router.get("/:id", async (req, res) => {
  // 轉為數字
  const id = Number(req.params.id);
  const sql = "SELECT * FROM prod_list WHERE id = ?";

  try {
    // 使用動態路由
    const [row] = await db.query(sql, [id]);
    res.json({ status: "success", data: { row } });
  } catch (error) {
    res.status(500).json({ error: "Database query error" });
  }
});

export default router;
