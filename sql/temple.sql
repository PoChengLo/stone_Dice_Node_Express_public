-- 品牌單選 (查詢字串qs: brand=Apple)
SELECT *
FROM my_product
WHERE brand = 'Apple';

-- 品牌複選  (查詢字串qs: brands=Apple,Google)
-- 使用 OR
SELECT *
FROM my_product
WHERE brand = 'Apple' OR brand = 'Google';

-- 使用 IN
SELECT *
FROM my_product
WHERE brand IN ('Apple','Google');

-------

-- 關鍵字 (查詢字串qs: name_like=sa)
SELECT *
FROM my_product
WHERE name LIKE '%sa%';

-- 價格區間 例如5000~15000  (查詢字串qs: price_gte=5000&price_lte=15000)
-- 使用 AND 與 大於小於符號
SELECT *
FROM my_product
WHERE price >= 5000 AND price <= 15000;

-- 使用 BETWEEN
SELECT *
FROM my_product
WHERE price BETWEEN 5000 AND 15000;

-----

-- 整合測試(每個條件使用AND相連，會讓資料集合愈來愈少)
SELECT *
FROM my_product
WHERE brand IN ('Apple','Google')
AND name LIKE '%sa%'
AND price BETWEEN 5000 AND 15000;

-- 排序，例如價格由低到高 (查詢字串qs: sort=price&order=asc) (順向asc，逆向desc)
SELECT *
FROM my_product
WHERE brand IN ('Apple','Google')
ORDER BY price ASC;

-- 分頁 (查詢字串qs: page=2&perpage=5) (目前第page頁，每頁perpage筆資料)
-- 公式: limit = perpage
--       offset = (page-1) * perpage
SELECT *
FROM my_product
WHERE brand IN ('Apple','Google')
ORDER BY price ASC
LIMIT 5 OFFSET 5;

-- 進行分頁時，還需額外執行，在此條件下總共多少筆資料。
-- 目的是為了提供總筆數量，給前台進行分頁列呈現與控制使用，例如有多少頁，最大能點選第幾頁…等。
SELECT COUNT(*) AS count
FROM my_product
WHERE brand IN ('Apple','Google');