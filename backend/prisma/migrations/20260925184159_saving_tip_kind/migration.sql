/*
  Warnings:

  - Added the required column `kind` to the `saving_tips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `saving_tips` ADD COLUMN `kind` ENUM('AVERAGE_SPIKE', 'BUDGET_EXCEEDED') NOT NULL;
