/*
  Warnings:

  - You are about to drop the column `content` on the `flows` table. All the data in the column will be lost.
  - You are about to drop the column `steps` on the `flows` table. All the data in the column will be lost.
  - You are about to drop the column `templateSettings` on the `flows` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `steps` on the `templates` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[flowId]` on the table `integrations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Made the column `content` on table `posts` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_authorId_fkey`;

-- DropIndex
DROP INDEX `verification_tokens_token_key` ON `verification_tokens`;

-- AlterTable
ALTER TABLE `flows` DROP COLUMN `content`,
    DROP COLUMN `steps`,
    DROP COLUMN `templateSettings`,
    ADD COLUMN `templateId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `posts` DROP COLUMN `authorId`,
    DROP COLUMN `published`,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL,
    MODIFY `content` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `templates` DROP COLUMN `content`,
    DROP COLUMN `steps`;

-- CreateTable
CREATE TABLE `templateSteps` (
    `id` VARCHAR(191) NOT NULL,
    `templateId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NOT NULL,
    `content` JSON NOT NULL,
    `order` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `flowSteps` (
    `id` VARCHAR(191) NOT NULL,
    `flowId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NOT NULL,
    `content` JSON NOT NULL,
    `order` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `integrations_flowId_key` ON `integrations`(`flowId`);

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `templateSteps` ADD CONSTRAINT `templateSteps_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `templates`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flowSteps` ADD CONSTRAINT `flowSteps_flowId_fkey` FOREIGN KEY (`flowId`) REFERENCES `flows`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
