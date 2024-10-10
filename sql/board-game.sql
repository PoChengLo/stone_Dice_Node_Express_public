-- 預設排序 id
SELECT * FROM prod_list LIMIT 8 OFFSET 0;

-- 關鍵字搜尋 (查詢字串qs: prod_name_like=台灣)
SELECT * FROM prod_list WHERE  prod_name LIKE '%台灣%' OR prod_desc  LIKE '%開心%' OR prod_intro  LIKE '%有趣%' OR prod_rules  LIKE '%角色%';

-- 價格區間 例如5000~15000  (查詢字串qs: price_gte=5000&price_lte=15000)
-- 使用 AND 與 大於小於符號
SELECT * FROM prod_list WHERE price >= 1600 AND price <= 1800 ORDER BY price DESC;

-- 整合測試(每個條件使用AND相連，會讓資料集合愈來愈少)
SELECT * FROM prod_list WHERE prod_name LIKE '%魔法%' AND price >= 2000 AND price <= 2500;


-- 最低1100 最高2800
SELECT * FROM prod_list ORDER BY price ASC;

-- 測試
SELECT pl.*,tl.tag_name FROM prod_list pl  JOIN prod_tag pt ON pl.id = pt.id JOIN tag_list tl ON pt.tag_id = tl.tag_id;

-- 測試
SELECT * FROM recipient_info WHERE user_id = 2024001;

-- 測試
SELECT * FROM prod_list WHERE prod_sales > 600;

-- 測試
SELECT * FROM prod_ord_list pl LEFT JOIN prod_ord_item pi ON pl.ord_id = pi.ord_id;


-- 測試 收到前端，localStorage的購物車，存入order_items
INSERT INTO `prod_ord_item`( `ord_id`, `id`, `prod_name` , `item_price`, `item_qty`, `item_total`) VALUES ('2','255','hello','2200','1','2200')

-- 測試 先寫，拿到order_id
INSERT INTO `prod_ord_list`( `user_id`, `ord_total`, `ord_pay`, `ord_recipient_name`, `ord_contact_number`, `ord_contact_address`) VALUES ('2024001','2200','1','陳家豪','0919338523','臺中市豐原區三村路27號')

