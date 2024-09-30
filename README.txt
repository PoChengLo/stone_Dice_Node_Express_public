1. 建立自己的.env檔
需要包含下列程式碼
WEB_PORT=3006
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=the_dice_db
DB_USERNAME={你的資料庫使用者名稱}
DB_PASSWORD={你的資料庫使用者密碼}

2. Database 設定
刪掉 test_0901
新增 127.0.0.1 Database

=======================================

3. 法蘭ㄉ login小教學！
如果你的伺服器出現了一些未知的問題，請嘗試這幾個方法：

A.確認SQL的user_info已更新
密碼改為hush過的形式：$2b$12$K14BkVJBCxu9czp0r5c97O1shwKhyabSmWGS4.h4PFRTvfsMfKVCu（實際上就是Abc_123456）

B. npm i 一下！確定您有裝到 bcrypt

C. 把這個加入你的.env裡面
ACCESS_TOKEN_SECRET=SOME_RANDOM_SECRET_KEY

D.使用POSTMAN！
POST http://localhost:3006/backend/user-profile/login
body 傳送 JSON {
  "email": "abigail6999@hotmail.com",
  "password": "Abc_123456"
}

如果有成功回傳Token ===> 開始處理前端
如果沒有成功回傳Token ===> 大喊：法蘭救命！

=======================================

4. 前端部分
A. 打開configs裡面的index檔案
B. 確定裡面的東西長這樣：
export const apiBaseUrl = 'http://localhost:3006/backend'
export const avatarBaseUrl = 'http://localhost:3006/avatar'

如果前端無法跟後端連線，請嘗試改成這樣：
export const apiBaseUrl = 'http://localhost:3006/api'
export const avatarBaseUrl = 'http://localhost:3006/avatar'

如果你成功了 ===> 恭喜！
如果你失敗了 ===> 大喊：法蘭法蘭救救我！
