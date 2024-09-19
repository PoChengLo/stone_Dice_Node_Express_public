import express from "express";
import boardGame from "./routes/board-game.js";
import multer from "multer";
import db from "./configs/mysql.js";
const app = express();
const port = process.env.WEB_PORT || 3002;

// 頂層中介軟體 開始
// 剖析 POST 與 PUT 要求的JSON格式資料
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// 頂層中介軟體 結束

// 自訂頂層中介軟體 開始
app.use((req, res, next) => {
  // 預設網站名稱
  res.locals.title = "The Dice In The Stone";
  // 往下走
  next();
});
// 自訂頂層中介軟體 結束

// 測試 json 接收表單路由
const upload = multer();
app.post("/try-post-form2", upload.none(), (req, res) => {
  res.json(req.body);
});

// 使用靜態網頁public
app.use(express.static("public"));

//測試
app.get("/try-db", async (req, res) => {
  const sql = "SELECT * FROM prod_list LIMIT 3";
  const [rows, fields] = await db.query(sql);
  // rows 讀取的資料
  // fields 表的欄位定義相關資料
  res.json({ rows });
});

// 桌遊商品路由
app.use("/board-game", boardGame);
// 定義路由，get 接收方式，"/" 路徑
app.get("/", (req, res) => {
  res.send(`<h1>您好</h1>`);
});

app.listen(port, () => {
  console.log(`${port}`);
});
