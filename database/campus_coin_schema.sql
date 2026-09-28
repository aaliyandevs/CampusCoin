-- =====================================================================
-- CampusCoin Database Schema
-- SharpStackers | TechWiz 7 - Aptech Limited
-- MySQL 8.0+ compatible (tested on MariaDB / Aiven MySQL)
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `campus_coin` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `campus_coin`;

SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- Table: users
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `passwordHash` varchar(191) NOT NULL,
  `role` enum('STUDENT','ADMIN') NOT NULL DEFAULT 'STUDENT',
  `academicYear` varchar(191) DEFAULT NULL,
  `monthlyAllowance` decimal(10,2) DEFAULT NULL,
  `monthlySavingsGoal` decimal(10,2) DEFAULT NULL,
  `isDisabled` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table: categories
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `type` enum('INCOME','EXPENSE') NOT NULL,
  `isDefault` tinyint(1) NOT NULL DEFAULT 0,
  `userId` int(11) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_userId_name_type_key` (`userId`,`name`,`type`),
  CONSTRAINT `categories_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table: transactions
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `categoryId` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `type` enum('INCOME','EXPENSE') NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `date` date NOT NULL,
  `aiSuggestedCategoryId` int(11) DEFAULT NULL,
  `isRecurringTemplate` tinyint(1) NOT NULL DEFAULT 0,
  `recurrenceInterval` enum('WEEKLY','MONTHLY') DEFAULT NULL,
  `nextOccurrenceDate` date DEFAULT NULL,
  `recurringSourceId` int(11) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `transactions_userId_date_idx` (`userId`,`date`),
  KEY `transactions_categoryId_fkey` (`categoryId`),
  KEY `transactions_recurringSourceId_fkey` (`recurringSourceId`),
  CONSTRAINT `transactions_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `transactions_recurringSourceId_fkey` FOREIGN KEY (`recurringSourceId`) REFERENCES `transactions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `transactions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table: budgets
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `budgets`;
CREATE TABLE `budgets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `categoryId` int(11) NOT NULL,
  `month` date NOT NULL,
  `limitAmount` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `budgets_userId_categoryId_month_key` (`userId`,`categoryId`,`month`),
  KEY `budgets_categoryId_fkey` (`categoryId`),
  CONSTRAINT `budgets_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `budgets_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table: saving_tips
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `saving_tips`;
CREATE TABLE `saving_tips` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `categoryId` int(11) DEFAULT NULL,
  `month` date NOT NULL,
  `tipText` varchar(500) NOT NULL,
  `impactScore` decimal(10,2) NOT NULL,
  `isPinned` tinyint(1) NOT NULL DEFAULT 0,
  `isDismissed` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `kind` enum('AVERAGE_SPIKE','BUDGET_EXCEEDED') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `saving_tips_userId_fkey` (`userId`),
  KEY `saving_tips_categoryId_fkey` (`categoryId`),
  CONSTRAINT `saving_tips_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `saving_tips_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table: insights
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `insights`;
CREATE TABLE `insights` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `month` date NOT NULL,
  `summaryText` text NOT NULL,
  `tipText` text DEFAULT NULL,
  `isBookmarked` tinyint(1) NOT NULL DEFAULT 0,
  `generatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `insights_userId_month_key` (`userId`,`month`),
  CONSTRAINT `insights_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table: announcements
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `announcements`;
CREATE TABLE `announcements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(191) NOT NULL,
  `body` text NOT NULL,
  `createdBy` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `announcements_createdBy_fkey` (`createdBy`),
  CONSTRAINT `announcements_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table: password_reset_tokens
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `tokenHash` varchar(191) NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `usedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `password_reset_tokens_userId_fkey` (`userId`),
  CONSTRAINT `password_reset_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table: sessions
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `tokenHash` varchar(191) NOT NULL,
  `userAgent` varchar(255) DEFAULT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `lastUsedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `sessions_tokenHash_key` (`tokenHash`),
  KEY `sessions_userId_idx` (`userId`),
  CONSTRAINT `sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- Sample / Seed Data
-- Includes the demo admin + student accounts used for evaluation.
-- Passwords below are bcrypt hashes of:
--   admin@campuscoin.local  -> Admin@12345
--   demo@campuscoin.local   -> Demo@12345
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 0;

INSERT INTO `users` (`id`, `name`, `email`, `passwordHash`, `role`, `academicYear`, `monthlyAllowance`, `monthlySavingsGoal`, `isDisabled`, `createdAt`) VALUES (1,'Campus Coin Admin','admin@campuscoin.local','$2b$10$kovj6/1ZPqy71f8095NWYeFcgGSjgGBl2biYoafByNZdmcqAyR6hG','ADMIN',NULL,NULL,NULL,0,'2026-09-28 14:44:31.802'),
(2,'Demo Student','demo@campuscoin.local','$2b$10$n0uJcYc7B6TJlcJ/sFEy1eP0zCmausCebXXHLuXqfrbsQ92FK8yuy','STUDENT','2nd Year',500.00,100.00,0,'2026-09-28 14:44:31.886');
INSERT INTO `categories` (`id`, `name`, `type`, `isDefault`, `userId`, `createdAt`) VALUES (1,'Allowance','INCOME',1,NULL,'2026-09-28 14:44:31.600'),
(2,'Part-time Job','INCOME',1,NULL,'2026-09-28 14:44:31.667'),
(3,'Scholarship','INCOME',1,NULL,'2026-09-28 14:44:31.670'),
(4,'Gift','INCOME',1,NULL,'2026-09-28 14:44:31.673'),
(5,'Other Income','INCOME',1,NULL,'2026-09-28 14:44:31.676'),
(6,'Food','EXPENSE',1,NULL,'2026-09-28 14:44:31.678'),
(7,'Transport','EXPENSE',1,NULL,'2026-09-28 14:44:31.681'),
(8,'Hostel/Rent','EXPENSE',1,NULL,'2026-09-28 14:44:31.683'),
(9,'Academics','EXPENSE',1,NULL,'2026-09-28 14:44:31.686'),
(10,'Subscriptions','EXPENSE',1,NULL,'2026-09-28 14:44:31.688'),
(11,'Entertainment','EXPENSE',1,NULL,'2026-09-28 14:44:31.690'),
(12,'Miscellaneous','EXPENSE',1,NULL,'2026-09-28 14:44:31.692');
INSERT INTO `transactions` (`id`, `userId`, `categoryId`, `amount`, `type`, `description`, `date`, `aiSuggestedCategoryId`, `isRecurringTemplate`, `recurrenceInterval`, `nextOccurrenceDate`, `recurringSourceId`, `createdAt`) VALUES (1,2,1,500.00,'INCOME','Monthly allowance','2026-09-01',NULL,0,NULL,NULL,NULL,'2026-09-28 14:44:31.893'),
(2,2,2,220.00,'INCOME','Campus bookstore shift','2026-09-15',NULL,0,NULL,NULL,NULL,'2026-09-28 14:44:31.896'),
(3,2,6,45.50,'EXPENSE','Groceries','2026-09-03',NULL,0,NULL,NULL,NULL,'2026-09-28 14:44:31.898'),
(4,2,6,18.75,'EXPENSE','Dinner with friends','2026-09-09',NULL,0,NULL,NULL,NULL,'2026-09-28 14:44:31.900'),
(5,2,6,32.00,'EXPENSE','Meal plan top-up','2026-09-20',NULL,0,NULL,NULL,NULL,'2026-09-28 14:44:31.901'),
(6,2,7,25.00,'EXPENSE','Bus pass','2026-09-05',NULL,0,NULL,NULL,NULL,'2026-09-28 14:44:31.903'),
(7,2,8,300.00,'EXPENSE','Monthly rent','2026-09-01',NULL,0,NULL,NULL,NULL,'2026-09-28 14:44:31.905'),
(8,2,9,60.00,'EXPENSE','Textbooks','2026-09-12',NULL,0,NULL,NULL,NULL,'2026-09-28 14:44:31.906'),
(9,2,10,15.99,'EXPENSE','Streaming subscription','2026-09-07',NULL,0,NULL,NULL,NULL,'2026-09-28 14:44:31.908'),
(10,2,11,22.00,'EXPENSE','Movie night','2026-09-18',NULL,0,NULL,NULL,NULL,'2026-09-28 14:44:31.909'),
(11,2,1,500.00,'INCOME','Monthly allowance','2026-08-01',NULL,0,NULL,NULL,NULL,'2026-09-28 14:44:31.911'),
(12,2,4,50.00,'INCOME','Birthday gift','2026-08-10',NULL,0,NULL,NULL,NULL,'2026-09-28 14:44:31.912'),
(13,2,6,52.30,'EXPENSE','Groceries','2026-08-04',NULL,0,NULL,NULL,NULL,'2026-09-28 14:44:31.913'),
(14,2,7,25.00,'EXPENSE','Bus pass','2026-08-05',NULL,0,NULL,NULL,NULL,'2026-09-28 14:44:31.915'),
(15,2,8,300.00,'EXPENSE','Monthly rent','2026-08-01',NULL,0,NULL,NULL,NULL,'2026-09-28 14:44:31.916'),
(16,2,11,40.00,'EXPENSE','Concert ticket','2026-08-22',NULL,0,NULL,NULL,NULL,'2026-09-28 14:44:31.918'),
(17,2,12,12.50,'EXPENSE','Laundry','2026-08-27',NULL,0,NULL,NULL,NULL,'2026-09-28 14:44:31.919');
INSERT INTO `budgets` (`id`, `userId`, `categoryId`, `month`, `limitAmount`) VALUES (1,2,6,'2026-09-01',150.00),
(2,2,7,'2026-09-01',30.00),
(3,2,11,'2026-09-01',40.00);
INSERT INTO `saving_tips` (`id`, `userId`, `categoryId`, `month`, `tipText`, `impactScore`, `isPinned`, `isDismissed`, `createdAt`, `kind`) VALUES (1,2,6,'2026-09-01','Your Food spending this month ($96.25) is 452% higher than your recent average ($17.43). Try capping it to save around $78.82.',78.82,0,0,'2026-09-28 14:45:48.629','AVERAGE_SPIKE'),
(2,2,7,'2026-09-01','Your Transport spending this month ($25.00) is 200% higher than your recent average ($8.33). Try capping it to save around $16.67.',16.67,0,0,'2026-09-28 14:45:48.642','AVERAGE_SPIKE'),
(3,2,8,'2026-09-01','Your Hostel/Rent spending this month ($300.00) is 200% higher than your recent average ($100.00). Try capping it to save around $200.00.',200.00,0,0,'2026-09-28 14:45:48.702','AVERAGE_SPIKE'),
(4,2,11,'2026-09-01','Your Entertainment spending this month ($22.00) is 65% higher than your recent average ($13.33). Try capping it to save around $8.67.',8.67,0,0,'2026-09-28 14:45:48.735','AVERAGE_SPIKE');

SET FOREIGN_KEY_CHECKS = 1;
