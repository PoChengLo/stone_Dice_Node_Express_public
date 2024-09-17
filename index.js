import express from "express";
const app = express();
// 定義路由
app.get("/", (req, res) => {
  res.send(`<h1>您好</h1>`);
});
app.listen(3005, () => {
  console.log("express server 啟動了");
});
