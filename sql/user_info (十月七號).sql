-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-10-07 07:52:46
-- 伺服器版本： 8.4.0
-- PHP 版本： 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `the_dice_db`
--

-- --------------------------------------------------------

--
-- 資料表結構 `user_info`
--

CREATE TABLE `user_info` (
  `user_id` int NOT NULL,
  `user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `real_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `nick_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `user_img` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `create_day` date NOT NULL,
  `last_date` date DEFAULT NULL,
  `qr_img` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `mobile` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `line_uid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `google_uid` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- 傾印資料表的資料 `user_info`
--

INSERT INTO `user_info` (`user_id`, `user_name`, `email`, `password`, `real_name`, `nick_name`, `user_img`, `birthday`, `create_day`, `last_date`, `qr_img`, `mobile`, `line_uid`, `google_uid`) VALUES
(2024001, 'abigail6999', 'abigail6999@hotmail.com', '$2b$12$K14BkVJBCxu9czp0r5c97O1shwKhyabSmWGS4.h4PFRTvfsMfKVCu', '陳家豪', '黑色劍士凱茲', 'http://ssl.gstatic.com/accounts/ui/avatar_2x.png', '1970-09-01', '2024-07-21', '2024-07-25', '', '0919338523', 'abigail6999', NULL),
(2024002, 'michelle9875', 'michelle9875@gmail.com', '$2b$12$K14BkVJBCxu9czp0r5c97O1shwKhyabSmWGS4.h4PFRTvfsMfKVCu', '許書豪', '古力菲斯', 'http://ssl.gstatic.com/accounts/ui/avatar_2x.png', '1986-10-28', '2024-07-10', '2024-09-10', '', '0913687185', 'michelle9875', NULL),
(2024003, 'gonzales_6011', 'gonzales_6011@gmail.com', '$2b$12$K14BkVJBCxu9czp0r5c97O1shwKhyabSmWGS4.h4PFRTvfsMfKVCu', '劉木森', '派克', 'http://ssl.gstatic.com/accounts/ui/avatar_2x.png', '1974-12-22', '2024-06-29', '2024-09-10', '', '0968696277', 'gonzales6011', NULL),
(2024004, 'charles6175_eva', 'charles6175_eva@yahoo.com.tw', '$2b$12$K14BkVJBCxu9czp0r5c97O1shwKhyabSmWGS4.h4PFRTvfsMfKVCu', '洪昌瀚', '喀絲卡', 'http://ssl.gstatic.com/accounts/ui/avatar_2x.png', '1987-01-16', '2024-07-22', '2024-08-05', '', '0930440497', 'charles6175', NULL),
(2024005, 'h1-hart8409', 'h1-hart8409@gmail.com', '$2b$12$K14BkVJBCxu9czp0r5c97O1shwKhyabSmWGS4.h4PFRTvfsMfKVCu', '蔡婉宜', '法露', 'http://ssl.gstatic.com/accounts/ui/avatar_2x.png', '2001-10-23', '2024-06-05', '2024-08-12', '', '0970927555', 'hart8409', NULL),
(2024006, 'janna-6523-A1', 'janna-6523-A1@outlook.com', '$2b$12$K14BkVJBCxu9czp0r5c97O1shwKhyabSmWGS4.h4PFRTvfsMfKVCu', '廖淑惠', '賽路畢克', 'http://ssl.gstatic.com/accounts/ui/avatar_2x.png', '2009-01-12', '2024-07-01', '2024-07-02', '', '0982424074', 'janna65A1', NULL),
(2024007, 'shelley556', 'shelley556@gmail.com', '$2b$12$K14BkVJBCxu9czp0r5c97O1shwKhyabSmWGS4.h4PFRTvfsMfKVCu', '韓宜鳳', '亞桑', 'http://ssl.gstatic.com/accounts/ui/avatar_2x.png', '1985-06-09', '2024-06-16', '2024-09-10', '', '0914064513', 'shelley556', NULL),
(2024008, 'pamela_8113', 'pamela_8113@yahoo.com.tw', '$2b$12$K14BkVJBCxu9czp0r5c97O1shwKhyabSmWGS4.h4PFRTvfsMfKVCu', '郭堇翔', '伊西特羅', 'http://ssl.gstatic.com/accounts/ui/avatar_2x.png', '1967-04-30', '2024-07-03', '2024-09-29', '', '0970289357', 'pamela8113', NULL),
(2024009, 'shelley_5560', 'shelley_5560@gmail.com', '$2b$12$K14BkVJBCxu9czp0r5c97O1shwKhyabSmWGS4.h4PFRTvfsMfKVCu', '王鴻', '希凱兒', 'http://ssl.gstatic.com/accounts/ui/avatar_2x.png', '1983-05-14', '2024-06-11', '2024-09-16', '', '0920839835', 'shelley5560', NULL),
(2024010, 'lautner_95a46', 'lautner_95a46@icloud.com', '$2b$12$K14BkVJBCxu9czp0r5c97O1shwKhyabSmWGS4.h4PFRTvfsMfKVCu', '馬寶珠', '依巴蕾拉', 'http://ssl.gstatic.com/accounts/ui/avatar_2x.png', '1988-06-27', '2024-06-25', '2024-07-12', '', '0925219595', 'lautner95a46', NULL),
(2024011, 'Griffin9881', 'Griffin9881@hotmail.com', '$2b$12$K14BkVJBCxu9czp0r5c97O1shwKhyabSmWGS4.h4PFRTvfsMfKVCu', '張婧瑞', '羅德里克', 'http://ssl.gstatic.com/accounts/ui/avatar_2x.png', '1996-09-21', '2024-07-13', '2024-09-18', '', '0908168880', 'Griffin9881', NULL),
(2024012, 'blake4168', 'blake4168@yahoo.com.tw', '$2b$12$K14BkVJBCxu9czp0r5c97O1shwKhyabSmWGS4.h4PFRTvfsMfKVCu', '鄭懋馨', '洛克斯', 'http://ssl.gstatic.com/accounts/ui/avatar_2x.png', '1977-07-24', '2024-06-20', '2024-09-30', '', '0932575559', 'blake4168', NULL),
(2024013, 'calder9249', 'calder9249@gmail.com', '$2b$12$K14BkVJBCxu9czp0r5c97O1shwKhyabSmWGS4.h4PFRTvfsMfKVCu', '張新華', '古倫貝路多', 'http://ssl.gstatic.com/accounts/ui/avatar_2x.png', '2002-01-02', '2024-07-03', '2024-10-01', '', '0961549938', 'calder9249', NULL),
(2024014, 'garver4235', 'garver4235@gmail.com', '$2b$12$K14BkVJBCxu9czp0r5c97O1shwKhyabSmWGS4.h4PFRTvfsMfKVCu', '羅凡', '阿巴英', 'http://ssl.gstatic.com/accounts/ui/avatar_2x.png', '1993-06-14', '2024-06-02', '2024-06-15', '', '0911341901', 'garver4235', NULL),
(2024015, 'vincent-6896', 'vincent-6896@gmail.com', '$2b$12$K14BkVJBCxu9czp0r5c97O1shwKhyabSmWGS4.h4PFRTvfsMfKVCu', '鄧小平', '波伊得', 'http://ssl.gstatic.com/accounts/ui/avatar_2x.png', '1983-03-04', '2024-06-14', '2024-06-22', '', '0979600262', 'vincent6896', NULL),
(2024016, '8964_harmon', '8964_harmon@gmail.com', '$2b$12$K14BkVJBCxu9czp0r5c97O1shwKhyabSmWGS4.h4PFRTvfsMfKVCu', '劉惠', '康拉達', 'http://ssl.gstatic.com/accounts/ui/avatar_2x.png', '1994-06-03', '2024-06-05', '2024-09-10', '', '0916196432', '8964harmon', NULL),
(2024017, '0401_garver4235', '0401_garver4235@gmail.com', '$2b$12$K14BkVJBCxu9czp0r5c97O1shwKhyabSmWGS4.h4PFRTvfsMfKVCu', '劉銘傳', '霜之哀傷', 'http://ssl.gstatic.com/accounts/ui/avatar_2x.png', '1997-09-18', '2024-06-27', '2024-09-17', '', '0968612788', 'garver4235', NULL),
(2024018, 'aa_0985_aa', 'aa_0985_aa@yahoo.com.tw', '$2b$12$K14BkVJBCxu9czp0r5c97O1shwKhyabSmWGS4.h4PFRTvfsMfKVCu', '吳長慶', '臭臭束褲', 'http://ssl.gstatic.com/accounts/ui/avatar_2x.png', '2001-06-06', '2024-07-08', '2024-07-21', '', '0988924524', 'aa0985aa', NULL),
(2024019, 'cecil3997', 'cecil3997@icloud.com', '$2b$12$K14BkVJBCxu9czp0r5c97O1shwKhyabSmWGS4.h4PFRTvfsMfKVCu', '賴文光', '勇敢盜賊', 'http://ssl.gstatic.com/accounts/ui/avatar_2x.png', '1985-08-20', '2024-06-09', '2024-08-05', '', '0917168168', 'cecil3997', NULL),
(2024020, 'kelly1692', 'kelly1692@gmail.com', '$2b$12$K14BkVJBCxu9czp0r5c97O1shwKhyabSmWGS4.h4PFRTvfsMfKVCu', '鄒俊宥', '火之高興', 'http://ssl.gstatic.com/accounts/ui/avatar_2x.png', '2002-12-18', '2024-06-21', '2024-09-09', '', '0902728846', 'kelly1692', NULL);

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `user_info`
--
ALTER TABLE `user_info`
  ADD PRIMARY KEY (`user_id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `user_info`
--
ALTER TABLE `user_info`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2024022;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
