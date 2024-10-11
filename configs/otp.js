import * as OTPAuth from "otpauth";
import "dotenv/config.js";
import db from "./mysql.js";

const otpSecret = process.env.OTP_SECRET;

// 生成 OTP 並存入資料庫
const generateAndStoreToken = async (email = "") => {
  // 建立新的 TOTP 物件
  let totp = new OTPAuth.TOTP({
    issuer: "express-base",
    label: email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromLatin1(email + otpSecret),
  });

  const token = totp.generate();

  // 儲存 OTP 到資料庫
  try {
    const [result] = await db.execute(
      "INSERT INTO otp_tokens (email, token, created_at) VALUES (?, ?, NOW())",
      [email, token]
    );
    console.log("OTP 已成功儲存", result);
  } catch (error) {
    console.error("儲存 OTP 時出錯:", error);
  }

  return token;
};

// 驗證 OTP
const verifyToken = async (email, token) => {
  try {
    // 從資料庫中查找該 email 和 token
    const [rows] = await db.execute(
      "SELECT * FROM otp_tokens WHERE email = ? AND token = ? AND TIMESTAMPDIFF(SECOND, created_at, NOW()) <= 180",
      [email, token]
    );

    if (rows.length > 0) {
      console.log("OTP 驗證成功");
      return true;
    } else {
      console.log("OTP 驗證失敗");
      return false;
    }
  } catch (error) {
    console.error("驗證 OTP 時出錯:", error);
    return false;
  }
};

export { generateAndStoreToken, verifyToken };
