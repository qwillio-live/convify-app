/*
  Warnings:

  - Added the required column `steps` to the `templates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `integrations` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `templates` ADD COLUMN `steps` JSON NOT NULL;
