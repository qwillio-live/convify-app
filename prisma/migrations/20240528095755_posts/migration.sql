/*
  Warnings:

  - You are about to drop the column `userId` on the `posts` table. All the data in the column will be lost.
  - You are about to alter the column `content` on the `posts` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - Added the required column `authorId` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_userId_fkey`;

-- AlterTable
ALTER TABLE `posts` DROP COLUMN `userId`,
    ADD COLUMN `authorId` VARCHAR(191) NOT NULL,
    ADD COLUMN `published` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `content` JSON NULL;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
