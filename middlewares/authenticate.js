import jsonwebtoken from "jsonwebtoken";
import "dotenv/config.js";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

export default function authenticate(req, res, next) {
  // 從 cookies 或 Authorization header 中取得 token
  const authHeader = req.headers.authorization;
  const token =
    req.cookies?.accessToken || (authHeader && authHeader.split(" ")[1]);

  // 檢查是否有 token
  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "授權失敗，沒有存取令牌",
    });
  }

  // 驗證 token 的合法性
  jsonwebtoken.verify(token, accessTokenSecret, (err, user) => {
    if (err) {
      // 判斷具體的錯誤類型
      const message =
        err.name === "TokenExpiredError" ? "Token已過期" : "不合法的存取令牌";
      return res.status(403).json({
        status: "error",
        message,
      });
    }

    // 成功驗證後，將解碼的 user 資料附加到 req 物件中
    req.user = user;
    next();
  });
}
