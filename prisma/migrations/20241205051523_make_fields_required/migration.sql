/*
  Warnings:

  - Made the column `plainTextPasswordId` on table `faculty` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `faculty` required. This step will fail if there are existing NULL values in that column.
  - Made the column `plainTextPasswordId` on table `student` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `faculty` DROP FOREIGN KEY `Faculty_plainTextPasswordId_fkey`;

-- DropForeignKey
ALTER TABLE `faculty` DROP FOREIGN KEY `Faculty_userId_fkey`;

-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_plainTextPasswordId_fkey`;

-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_userId_fkey`;

-- AlterTable
ALTER TABLE `faculty` MODIFY `plainTextPasswordId` VARCHAR(191) NOT NULL,
    MODIFY `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `student` MODIFY `plainTextPasswordId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Faculty` ADD CONSTRAINT `Faculty_plainTextPasswordId_fkey` FOREIGN KEY (`plainTextPasswordId`) REFERENCES `plainTextPassword`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Faculty` ADD CONSTRAINT `Faculty_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_plainTextPasswordId_fkey` FOREIGN KEY (`plainTextPasswordId`) REFERENCES `plainTextPassword`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
