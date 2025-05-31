-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Час створення: Чрв 01 2025 р., 01:03
-- Версія сервера: 10.4.32-MariaDB
-- Версія PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База даних: `pii-lab`
--

-- --------------------------------------------------------

--
-- Структура таблиці `groups`
--

CREATE TABLE `groups` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп даних таблиці `groups`
--

INSERT INTO `groups` (`id`, `name`) VALUES
(1, 'PZ-31'),
(2, 'PZ-32'),
(3, 'PZ-33'),
(4, 'PZ-34'),
(5, 'PZ-35'),
(6, 'PZ-36'),
(7, 'PZ-37');

-- --------------------------------------------------------

--
-- Структура таблиці `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `group_id` int(11) NOT NULL,
  `gender` enum('male','female') NOT NULL,
  `birthday` date NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп даних таблиці `students`
--

INSERT INTO `students` (`id`, `first_name`, `last_name`, `group_id`, `gender`, `birthday`, `email`, `password`, `created_at`) VALUES
(1, 'Yurii', 'Stelmakh', 5, 'male', '2006-01-01', 'yurii.stelmakh.pz.2023@lpnu.ua', '$2y$10$iXMyeZZSEMhSzIcWjLT8Eu1XQtz0mdXo41MZFkqhidyx1po8l3Eke', '2025-05-31 22:11:47'),
(2, 'Andrii', 'Potikha', 6, 'male', '2006-01-02', 'andrii.potikha.pz.2023@lpnu.ua', '$2y$10$iQ0.CB0uOQNo3.WyHJLl0.OsDH6dYl.4Pkgx3FuNB2lxcVuPhi/bq', '2025-05-31 22:13:25'),
(3, 'Oleksii', 'Mahinskyi', 5, 'male', '2006-01-03', 'oleksii.mahinskyi.pz.2023@lpnu.ua', '$2y$10$/BmM2HufrvJs2kDc2fVqW.hY7POJSqhT0V5k/7mcvOul..335IBbe', '2025-05-31 22:14:10'),
(4, 'Iryna', 'Hrabovenska', 6, 'female', '2006-01-04', 'iryna.hrabovenska.pz.2023@lpnu.ua', '$2y$10$gacyeZE50uF8WZm1faa/UO0bMYG1oexnTbrYS0.F/JF8AQcJrRq1a', '2025-05-31 22:15:22'),
(5, 'Oleksandr', 'Zelinskyi', 6, 'male', '2006-01-05', 'oleksandr.zelinskyi.pz.2023@lpnu.ua', '$2y$10$u5.1uRnygmgG434k.ZLLBOmXyT8xOJYZGs8qJXCSsnp.BpdRuY1Zy', '2025-05-31 22:16:11'),
(6, 'Polina', 'Bakhmetieva', 5, 'female', '2006-01-06', 'polina.bakhmetieva.pz.2023@lpnu.ua', '$2y$10$zEpuw8YZTg23V.PhWMxf6u3qbX.mtY1u54kJQi6ns9TFc2fKT32.y', '2025-05-31 22:17:14'),
(7, 'Mariia', 'Lytvyn', 5, 'female', '2006-01-07', 'mariia.lytvyn.pz.2023@lpnu.ua', '$2y$10$46LOaGPc4knl0y17mzXKRuxIiIZZdsig81D1dOIPCjGHDZj1tqItG', '2025-05-31 22:18:24'),
(8, 'Ivan', 'Oliinyk', 5, 'male', '2006-01-08', 'ivan.oliinyk.pz.2023@lpnu.ua', '$2y$10$iKllq47JVOjWyBWYO7NdsuD0soN/ZtsArXX9z0U0sQ69vsK/E4IUq', '2025-05-31 22:19:19'),
(10, 'Name', 'Newsurname', 1, 'female', '2007-12-13', 'name.surname.pz@lpnu.ua', '$2y$10$yTuBng1AFElMjhPK/350n.J1aKeeuQI8V36FXyajA6eWoFZuwFNrq', '2025-05-31 22:53:52');

--
-- Індекси збережених таблиць
--

--
-- Індекси таблиці `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`);

--
-- Індекси таблиці `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT для збережених таблиць
--

--
-- AUTO_INCREMENT для таблиці `groups`
--
ALTER TABLE `groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT для таблиці `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
