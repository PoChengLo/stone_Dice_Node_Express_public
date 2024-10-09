import jsonwebtoken from "jsonwebtoken";
import "dotenv/config.js";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

export default function authenticate(req, res, next) {
  console.log("--- Authenticate Middleware Start ---");
  console.log("Cookies:", req.cookies);

  // 優先從 cookies 獲取 token
  let token = req.cookies?.accessToken;

  // 如果 cookies 中沒有找到 token，則嘗試從 Authorization header 獲取
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    token = authHeader.split(" ")[1]; // "Bearer <token>" 格式，提取 token
  }

  if (!token) {
    console.log("No token found in cookies or Authorization header");
    return res.status(401).json({
      status: "error",
      message: "授權失敗，沒有存取令牌",
    });
  }

  try {
    const decoded = jsonwebtoken.verify(token, accessTokenSecret);
    console.log("Token decoded successfully:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification error:", err.name, err.message);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        message: "Token已過期",
      });
    }
    return res.status(403).json({
      status: "error",
      message: "不合法的存取令牌",
    });
  } finally {
    console.log("--- Authenticate Middleware End ---");
  }
}
