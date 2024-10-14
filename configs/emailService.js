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
    subject: "石之骰召喚：你的秘密通行符文已準備就緒！",
    text: `您的 OTP 驗證碼是: ${otp}。此驗證碼將在 3 分鐘後失效。`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4e9d2; border: 2px solid #8b4513; border-radius: 10px;">
      <h1 style="color: #8b4513; text-align: center;">石之骰的神秘召喚</h1>
      <br>
      <p style="font-size: 16px; color: #333;">諸國度的冒險者，是否遺忘了重要的通行符文？</p>
      
      <p style="font-size: 16px; color: #333;">在你踏上尋找失落寶藏的征途之際，古老的石之骰已經回應了你的召喚。它為你鑄造了一枚強大的符文，蘊含著穿越密室、解開謎題的神秘力量。</p>
      
      <p style="font-size: 16px; color: #333;">請謹記，這枚符文蘊含著強大而短暫的魔力。你必須在接下來的 30 分鐘內使用它，否則它將消散於風中。</p>
      
      <p style="font-size: 18px; text-align: center;">你的神秘符文是：</p>
      
      <p style="font-size: 28px; font-weight: bold; color: #D92626; text-align: center;">${otp}</p>
      
      <p style="font-size: 16px; color: #333;">如果你並未尋求這樣的力量，那麼或許是某個狡猾的模仿者試圖冒充你的身份。在這種情況下，請將這封卷軸丟入熊熊燃燒的爐火中。</p>
      
      <p style="font-size: 14px; color: #666; text-align: right; margin-top: 30px;">願諸神保佑你的冒險之旅，<br>秘法商人 絕冬城的澤維爾 敬上</p>
    </div>
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
