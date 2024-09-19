import express from "express";
import boardGame from "./routes/board-game.js";
import multer from "multer";
import db from "./configs/mysql.js";
import cors from "cors";
const app = express();
const port = process.env.WEB_PORT || 3002;
const upload = multer();

// 頂層中介軟體 開始
// cors設定，參數為必要，注意不要只寫`app.use(cors())`
app.use(
  cors({
    origin: ["http://localhost:3000", "https://localhost:9000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
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
// app.post("/try-post-form2", upload.none(), (req, res) => {
//   res.json(req.body);
// });

// 使用靜態網頁public
app.use(express.static("public"));

// 測試資料庫資料是否有提取到，可修改prod_list為自己的資料表
// app.get("/try-db", async (req, res) => {
//   const sql = "SELECT * FROM prod_list LIMIT 3";
//   const [rows] = await db.query(sql);
//   // rows 讀取的資料
//   res.json({ rows });
// });

// 桌遊商品路由
app.use("/board-game", boardGame);

// 定義路由，get 接收方式，"/" 路徑
app.get("/", (req, res) => {
  res.send(`<h1>您好</h1>`);
});

app.listen(port, () => {
  console.log(`${port}`);
});
