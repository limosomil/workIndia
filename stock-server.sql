-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 27, 2020 at 09:46 AM
-- Server version: 5.7.26
-- PHP Version: 7.3.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `stock_game`
--

-- --------------------------------------------------------

--
-- Table structure for table `otp_data`
--

CREATE TABLE `otp_data` (
  `id` int(11) NOT NULL,
  `otp` varchar(6) NOT NULL,
  `phone` text NOT NULL,
  `date_created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `otp_data`
--

INSERT INTO `otp_data` (`id`, `otp`, `phone`, `date_created`) VALUES
(4, '809058', '9876543210', '2020-05-26 22:55:53');

-- --------------------------------------------------------

--
-- Table structure for table `user_data`
--

CREATE TABLE `user_data` (
  `id` int(11) NOT NULL,
  `first_name` text,
  `last_name` text,
  `phone` text NOT NULL,
  `date_registered` datetime NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `last_login_ip` text,
  `FCM_token` text,
  `login_token` text,
  `usr_setupdone` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_data`
--

INSERT INTO `user_data` (`id`, `first_name`, `last_name`, `phone`, `date_registered`, `last_login`, `last_login_ip`, `FCM_token`, `login_token`, `usr_setupdone`) VALUES
(10, NULL, NULL, '7666066985', '2020-05-26 02:04:22', NULL, NULL, NULL, NULL, 0),
(11, NULL, NULL, '9876543210', '2020-05-26 10:40:54', NULL, NULL, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `wallet`
--

CREATE TABLE `wallet` (
  `id` int(11) DEFAULT NULL,
  `balance` double NOT NULL DEFAULT '0',
  `funds_added` double NOT NULL DEFAULT '0',
  `funds_withdrawm` double NOT NULL DEFAULT '0',
  `money_won` double NOT NULL DEFAULT '0',
  `money_played` double NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `otp_data`
--
ALTER TABLE `otp_data`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `otp` (`otp`);

--
-- Indexes for table `user_data`
--
ALTER TABLE `user_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wallet`
--
ALTER TABLE `wallet`
  ADD KEY `id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `otp_data`
--
ALTER TABLE `otp_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user_data`
--
ALTER TABLE `user_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `wallet`
--
ALTER TABLE `wallet`
  ADD CONSTRAINT `wallet_ibfk_1` FOREIGN KEY (`id`) REFERENCES `user_data` (`id`);