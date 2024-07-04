-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 06, 2024 at 12:22 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `itemInCartCount` int(11) NOT NULL,
  `cartItems` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`cartItems`)),
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `userId`, `itemInCartCount`, `cartItems`, `createdAt`) VALUES
(1, 9, 0, '[]', '2024-03-06 10:25:35');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `categoryName` varchar(255) NOT NULL,
  `categoryImage` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `categoryName`, `categoryImage`, `createdAt`) VALUES
(1, 'MAKE UP', '/uploads/image_1709711464712.png', '2024-03-06 07:51:04'),
(2, 'SKIN CARE', '/uploads/image_1709711470396.png', '2024-03-06 07:51:10'),
(3, 'HAIR CARE', '/uploads/image_1709711476250.png', '2024-03-06 07:51:16'),
(4, 'Drinks', '/uploads/image_1709711589354.png', '2024-03-06 07:52:56');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `productName` varchar(255) NOT NULL,
  `productImage` varchar(255) NOT NULL,
  `productDescription` varchar(255) NOT NULL,
  `productQuantityInStock` int(11) NOT NULL,
  `productPrice` float NOT NULL,
  `itemTax` float NOT NULL,
  `categoryId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `vendorId` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `productName`, `productImage`, `productDescription`, `productQuantityInStock`, `productPrice`, `itemTax`, `categoryId`, `userId`, `vendorId`, `createdAt`) VALUES
(1, 'Coca Cola', '', '20ml x 6', 25, 20.99, 0.99, 4, 4, 8, '2024-03-06 07:08:40'),
(3, 'Pepsi', '/uploads/image_1709716038290.png', '20ml x 6', 25, 20.99, 0.99, 1, 4, 8, '2024-03-06 09:07:18'),
(4, 'Loreal', '/uploads/image_1709716047159.png', '20ml x 6', 25, 20.99, 0.99, 1, 4, 8, '2024-03-06 09:07:27'),
(5, 'Tibet', '/uploads/image_1709716072598.png', '20ml x 6', 25, 20.99, 0.99, 2, 4, 8, '2024-03-06 09:07:52'),
(6, 'Cascade', '/uploads/image_1709716110397.png', '20ml x 6', 25, 20.99, 0.99, 3, 4, 8, '2024-03-06 09:08:30');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `userName` varchar(255) NOT NULL,
  `userEmailOrPhone` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `roles` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`roles`)),
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `userName`, `userEmailOrPhone`, `password`, `roles`, `createdAt`) VALUES
(1, 'Test User 005', '03222122135', '$2b$10$Kkn0dDBcZFb5Iq2B.powrOXWpyDt7i/AboYkL1/mk5mBlIRI7aSRK', '[\"admin\",\"vendor\"]', '2024-03-05 09:53:01'),
(4, 'Test User 005', '03222122136', '$2b$10$XjkNRWLhEIr0orZ8tSsjPucNertn2q2JEgvm7WMG0046n4PEMPAOW', '[\"admin\",\"vendor\",\"rider\"]', '2024-03-05 09:53:25'),
(7, 'Test User 007', '03222122137', '$2b$10$jfeeqKx/84G0CjiqhUbkwu9hqVuCpZBvUW2mRQhI2lyVs8bG9dICi', '[\"rider\",\"vendor\"]', '2024-03-05 10:19:06'),
(9, 'Test User 100', '03222122190', '$2b$10$qeyoMKxey7AdhhEuBo4XpeFfW/yRaDQHDa7xwOKScUVy9mMVd2j8W', '[\"user\"]', '2024-03-06 10:25:35');

-- --------------------------------------------------------

--
-- Table structure for table `vendor`
--

CREATE TABLE `vendor` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `storeName` varchar(255) NOT NULL,
  `storeImage` varchar(255) NOT NULL,
  `storeDescription` varchar(255) NOT NULL,
  `storePhone` varchar(255) NOT NULL,
  `storeEmail` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `vendor`
--

INSERT INTO `vendor` (`id`, `userId`, `storeName`, `storeImage`, `storeDescription`, `storePhone`, `storeEmail`, `createdAt`) VALUES
(8, 4, 'My Store 2000', '/uploads/image_1709705241899.png', 'My Store 8200 Description', '0333223214', 'Storeemail@email222.com', '2024-03-05 10:21:04'),
(11, 7, 'My Store 1', 'iVBORw0KGgoAAAANSUhEUgAAAF0AAABDCAYAAAD+rQkoAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAACSdSURBVHgB7XxplF3VdeZ37r1vrno1qao0zxISIAlJgGUzGQwONjbGQzA4HkjHy5C03Xba7m7HvVb/JB2vXk66PfTq9GDSbui0odtgnHTaGBs7toEwCSSEplKV5lJJpRrfqzfe29/e59z', 'My Store 1 Description', '0333223212', 'ashshhssw@gmail.com', '2024-03-05 10:21:31');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userEmailOrPhone` (`userEmailOrPhone`);

--
-- Indexes for table `vendor`
--
ALTER TABLE `vendor`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userId` (`userId`),
  ADD UNIQUE KEY `storeEmail` (`storeEmail`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `vendor`
--
ALTER TABLE `vendor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
