/*
  Warnings:

  - Added the required column `flowSettings` to the `flows` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `responses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `flows` ADD COLUMN `flowSettings` JSON NOT NULL;

-- AlterTable
ALTER TABLE `responses` ADD COLUMN `content` JSON NOT NULL;
