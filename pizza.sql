-- 设置SQL模式和时区
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- 为保证脚本可重复执行，如果表存在则先删除
DROP TABLE IF EXISTS `order_pizzas`;
DROP TABLE IF EXISTS `pizza_toppings`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `user_contacts`;
DROP TABLE IF EXISTS `Feedback`;
DROP TABLE IF EXISTS `pizzas`;
DROP TABLE IF EXISTS `toppings`;
DROP TABLE IF EXISTS `users`;

--
-- 表的结构 `users`
--
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `hashed_password` varchar(255) NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 表的结构 `Feedback`
--
CREATE TABLE `Feedback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `feedback_text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 表的结构 `user_contacts`
--
CREATE TABLE `user_contacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 表的结构 `pizzas`
--
CREATE TABLE `pizzas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `veg` tinyint(1) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `quantity` int(11) DEFAULT 1,
  `img` varchar(255) DEFAULT NULL,
  `is_popular` tinyint(1) NOT NULL DEFAULT 0,
  `sizeandcrust` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 转存表中的数据 `pizzas`
--
INSERT INTO `pizzas` (`id`, `name`, `veg`, `price`, `description`, `quantity`, `img`, `is_popular`, `sizeandcrust`) VALUES
(1, 'Margherita', 1, 3.00, 'Cheese', 1, 'https://api.pizzahut.io/v1/content/en-in/in-1/images/pizza/margherita.90f9451fd66871fb6f9cf7d506053f18.1.jpg?width=550', 1, '{\"M\": {\"price\": 3.00}, \"L\": {\"price\": 5.00}, \"XL\": {\"price\": 7.00}}'),
(2, 'Tandoori Paneer', 1, 7.00, 'Spiced paneer, Onion, Green Capsicum & Red Paprika in Tandoori Sauce', 1, 'https://api.pizzahut.io/v1/content/en-in/in-1/images/pizza/tandoori-paneer.4ef45717e972cf45b43c010e3cde5a22.1.jpg?width=550', 1, '{\"M\": {\"price\": 7.00}, \"L\": {\"price\": 9.00}, \"XL\": {\"price\": 12.00}}'),
(3, 'Veggie Supreme', 1, 8.00, 'Black Olives, Green Capsicum, Mushroom, Onion, Red Paprika, Sweet Corn', 1, 'https://api.pizzahut.io/v1/content/en-in/in-1/images/pizza/veggie-supreme.bc8dd369182b636ff171077efa53c344.1.jpg?width=550', 1, '{\"M\": {\"price\": 8.00}, \"L\": {\"price\": 9.00}, \"XL\": {\"price\": 10.00}}'),
(4, 'Double Paneer Supreme', 1, 6.00, 'Spiced Paneer, Herbed Onion & Green Capsicum, Red Paprika', 1, 'https://api.pizzahut.io/v1/content/en-in/in-1/images/pizza/double-paneer-supreme.3cb382529b41d14d4a041b5cc5e64341.1.jpg?width=550', 0, '{\"M\": {\"price\": 6.00}, \"L\": {\"price\": 7.00}, \"XL\": {\"price\": 9.00}}'),
(5, 'Veggie Kebab Surprise', 1, 4.00, 'Veg Kebab, Onion, Green Capsicum, Tomato & Sweet Corn in Tandoori Sauce', 1, 'https://api.pizzahut.io/v1/content/en-in/in-1/images/pizza/veg-kebab-surprise.abab1dff179ab8cf95a59f30d6352297.1.jpg?width=550', 0, '{\"M\": {\"price\": 4.00}, \"L\": {\"price\": 6.00}, \"XL\": {\"price\": 8.00}}'),
(6, 'Chicken Supreme', 0, 7.00, 'Herbed Chicken, Schezwan Chicken Meatball, Chicken Tikka', 1, 'https://api.pizzahut.io/v1/content/en-in/in-1/images/pizza/chicken-supreme.6d53f104f071d304a47440f2fffa7378.1.jpg?width=550', 1, '{\"M\": {\"price\": 7.00}, \"L\": {\"price\": 9.00}, \"XL\": {\"price\": 12.00}}'),
(7, 'Chicken Tikka Supreme', 0, 6.00, 'Chicken Tikka, Chicken Malai Tikka, Onion, Red Paprika', 1, 'https://api.pizzahut.io/v1/content/en-in/in-1/images/pizza/chicken-tikka-supreme.830de5a911ca95a30e4ca98e529f1b3a.1.jpg?width=550', 1, '{\"M\": {\"price\": 6.00}, \"L\": {\"price\": 8.00}, \"XL\": {\"price\": 11.00}}'),
(8, 'Triple Chicken Feast', 0, 8.00, 'Schezwan Chicken Meatball Herbed Chicken, Chicken Sausage, Geen Capsicum, Onion, Red Paprika', 1, 'https://api.pizzahut.io/v1/content/en-in/in-1/images/pizza/triple-chicken-feast.e4a546e7a8581a60952b99e3fe22987e.1.jpg?width=550', 0, '{\"M\": {\"price\": 8.00}, \"L\": {\"price\": 10.00}, \"XL\": {\"price\": 13.00}}'),
(9, 'Chicken Tikka', 0, 7.00, 'Chicken Tikka, Onion, Tomato', 1, 'https://api.pizzahut.io/v1/content/en-in/in-1/images/pizza/chicken-tikka.6d441a65371e941db36c2754586119a8.1.jpg?width=550', 0, '{\"M\": {\"price\": 7.00}, \"L\": {\"price\": 8.00}, \"XL\": {\"price\": 9.00}}'),
(10, 'Double Chicken Sausage', 0, 5.00, 'Chicken Sausage', 1, 'https://api.pizzahut.io/v1/content/en-in/in-1/images/pizza/double-chicken-sausage.f172dd6a365e90e655258b17555e74ad.1.jpg?width=550', 0, '{\"M\": {\"price\": 5.00}, \"L\": {\"price\": 6.00}, \"XL\": {\"price\": 7.00}}');

--
-- 表的结构 `toppings`
--
CREATE TABLE `toppings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `is_veg` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 转存表中的数据 `toppings`
--
INSERT INTO `toppings` (`id`, `name`, `price`, `is_veg`) VALUES
(1, 'Extra Cheese', 1.50, 1),
(2, 'Mushrooms', 0.75, 1),
(3, 'Onions', 0.50, 1),
(4, 'Black Olives', 0.75, 1),
(5, 'Green Peppers', 0.50, 1),
(6, 'Pepperoni', 1.25, 0),
(7, 'Sausage', 1.25, 0),
(8, 'Bacon', 1.50, 0),
(9, 'Jalapeños', 0.60, 1);

--
-- 表的结构 `pizza_toppings`
--
CREATE TABLE `pizza_toppings` (
  `pizza_id` int(11) NOT NULL,
  `topping_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`pizza_id`,`topping_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 转存表中的数据 `pizza_toppings`
--
INSERT INTO `pizza_toppings` (`pizza_id`, `topping_id`, `quantity`) VALUES
(1, 1, 1),
(3, 2, 1),
(3, 3, 1),
(3, 4, 1),
(3, 5, 1),
(6, 6, 1),
(6, 7, 1);

--
-- 表的结构 `orders`
--
CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `rider_id` int(11) DEFAULT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Pending',
  `delivery_address` text,
  `contact_phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `rider_id` (`rider_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 表的结构 `order_pizzas`
--
CREATE TABLE `order_pizzas` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `pizza_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `size` varchar(50) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `toppings` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `pizza_id` (`pizza_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 为表 `user_contacts` 添加约束
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`rider_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- 为表 `order_pizzas` 添加约束
--
ALTER TABLE `order_pizzas`
  ADD CONSTRAINT `order_pizzas_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_pizzas_ibfk_2` FOREIGN KEY (`pizza_id`) REFERENCES `pizzas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 为表 `pizza_toppings` 添加约束
--
ALTER TABLE `pizza_toppings`
  ADD CONSTRAINT `pizza_toppings_ibfk_1` FOREIGN KEY (`pizza_id`) REFERENCES `pizzas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pizza_toppings_ibfk_2` FOREIGN KEY (`topping_id`) REFERENCES `toppings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 为表 `user_contacts` 添加约束
--
ALTER TABLE `user_contacts`
  ADD CONSTRAINT `user_contacts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;
