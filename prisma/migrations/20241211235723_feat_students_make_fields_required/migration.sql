/*
  Warnings:

  - Made the column `userId` on table `student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `studentId` on table `student` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_userId_fkey`;

-- AlterTable
ALTER TABLE `student` MODIFY `userId` VARCHAR(191) NOT NULL,
    MODIFY `studentId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
