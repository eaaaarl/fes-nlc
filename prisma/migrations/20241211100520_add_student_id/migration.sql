/*
  Warnings:

  - A unique constraint covering the columns `[studentId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `student` ADD COLUMN `studentId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Student_studentId_key` ON `Student`(`studentId`);
