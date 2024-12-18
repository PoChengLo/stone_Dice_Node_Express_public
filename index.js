import express from "express";
import boardGame from "./routes/board-game.js";
import larp from "./routes/larp.js";
import mysteryGame from "./routes/mystery-game.js";
import multer from "multer";
import db from "./configs/mysql.js";
import cors from "cors";
import loginRouter from "./routes/user-profile.js";
import Ecpay from "./routes/ecpay-test-only.js";
import cookieParser from "cookie-parser";
import shipment711 from "./routes/shipment.js";
import otpRouter from "./routes/otp.js";
const app = express();
const port = process.env.WEB_PORT || 3002;
const upload = multer();

// 剖折 Cookie
app.use(cookieParser());

// 頂層中介軟體 開始
// cors設定，參數為必要，注意不要只寫`app.use(cors())`
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "https://localhost:9000",
//       "https://stone-dice-next-public.vercel.app",
//       "https://main.d9qhhlcgc51yq.amplifyapp.com",
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

app.use(cors());
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

// 測試資料庫資料是否有提取到，可修改prod_list為自己的資料表
// app.get("/try-db", async (req, res) => {
//   const sql = "SELECT * FROM prod_list LIMIT 3";
//   const [rows] = await db.query(sql);
//   // rows 讀取的資料
//   res.json({ rows });
// });

// 桌遊商品路由
app.use("/board-game", boardGame);

// 密室逃脫路由
app.use("/larp", larp);

// 劇本殺路由
app.use("/mystery-game", mysteryGame);

// 登入路由
app.use("/user-profile", loginRouter);

// 綠界金流 test
app.use("/ecpay", Ecpay);

// 7-11 門市選擇
app.use("/shipment", shipment711);

// OTP路由
app.use("/otp", otpRouter);

// 定義路由，get 接收方式，"/" 路徑
app.get("/", (req, res) => {
  res.send(`<h1>您好</h1>`);
});

app.use("/avatar", express.static("public/avatar"));

// 使用靜態網頁public，需要放在所有路由後面、404前面
app.use(express.static("public"));

app.listen(port, () => {
  console.log(`server啟動: ${port}`);
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ status: "error", message: "Internal server error" });
});
