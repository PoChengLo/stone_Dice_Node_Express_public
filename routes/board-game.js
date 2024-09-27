import express from "express";
import db from "../configs/mysql.js";

const router = express.Router();

// 路由處理器
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

  let orderBy2 = "";
  const orderby = req.query.orderby;
  switch (orderby) {
    case "id_asc":
      orderBy2 = " ORDER BY id ASC";
      break;
    case "id_desc":
      orderBy2 = " ORDER BY id DESC";
      break;
  }
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
  console.log({ sql });

  const [rows] = await db.query(sql);

  // 進行分頁時，額外執行sql在此條件下總共多少筆資料
  const [rows2] = await db.query(`SELECT COUNT(*) AS count FROM prod_list`);
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
      where,
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
    res.json({ status: "success", data: { row } });
  } catch (error) {
    res.status(500).json({ error: "Database query error" });
  }
});

export default router;
