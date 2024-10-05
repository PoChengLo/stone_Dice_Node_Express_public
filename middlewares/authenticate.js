import jsonwebtoken from "jsonwebtoken";
import "dotenv/config.js";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

export default function authenticate(req, res, next) {
  console.log("--- Authenticate Middleware Start ---");
  console.log("Received headers:", JSON.stringify(req.headers, null, 2));
  console.log("Received cookies:", req.cookies);

  let token;
  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.headers.cookie) {
    const cookies = req.headers.cookie.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
    }, {});
    token = cookies.accessToken;
  }

  console.log("Extracted token:", token);

  if (!token) {
    console.log("No token found");
    return res.status(401).json({
      status: "error",
      message: "授權失敗，沒有存取令牌",
    });
  }

  // 驗證 token 的合法性
  try {
    const decoded = jsonwebtoken.verify(token, accessTokenSecret);
    console.log("Decoded token:", JSON.stringify(decoded, null, 2));
    req.user = decoded;
    console.log("Token verified successfully");
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    const message =
      err.name === "TokenExpiredError" ? "Token已過期" : "不合法的存取令牌";
    return res.status(403).json({
      status: "error",
      message,
    });
  } finally {
    console.log("--- Authenticate Middleware End ---");
  }
}
