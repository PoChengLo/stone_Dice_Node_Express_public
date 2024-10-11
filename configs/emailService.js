import nodemailer from "nodemailer";
import dotenv from "dotenv";

// 確保環境變量被加載
dotenv.config();

// 創建一個可重用的 transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * 發送包含 OTP 的郵件
 * @param {string} to 接收者的郵箱地址
 * @param {string} otp OTP 代碼
 * @returns {Promise<Object>} 包含發送狀態的對象
 */
export const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: "密碼重置 OTP",
    text: `您的 OTP 驗證碼是: ${otp}。此驗證碼將在 30 分鐘後失效。`,
    html: `
      <h1>密碼重置</h1>
      <p>您的 OTP 驗證碼是: <strong>${otp}</strong></p>
      <p>此驗證碼將在 30 分鐘後失效。</p>
      <p>如果您沒有請求重置密碼，請忽略此郵件。</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

/**
 * 測試郵件服務
 */
export const testEmailService = async () => {
  const testEmail = process.env.EMAIL_USER; // 使用發送者的郵箱作為測試接收者
  const testOTP = "123456";

  try {
    const result = await sendOTPEmail(testEmail, testOTP);
    if (result.success) {
      console.log("Test email sent successfully");
    } else {
      console.error("Test email failed:", result.error);
    }
  } catch (error) {
    console.error("An error occurred during the test:", error);
  }
};

/**
 * 檢查當前文件是否作為主模塊運行
 * @returns {boolean}
 */
const isMainModule = () => {
  if (
    typeof process !== "undefined" &&
    process.versions &&
    process.versions.node
  ) {
    return import.meta.url.startsWith("file:");
  }
  return false;
};

// 如果直接運行此文件，執行測試
if (isMainModule()) {
  testEmailService();
}
