/*
  Warnings:

  - You are about to drop the column `subjectId` on the `subjectevaluation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[subjectName,studentId]` on the table `SubjectEvaluation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `subjectevaluation` DROP FOREIGN KEY `SubjectEvaluation_subjectId_fkey`;

-- AlterTable
ALTER TABLE `subjectevaluation` DROP COLUMN `subjectId`;

-- CreateIndex
CREATE UNIQUE INDEX `SubjectEvaluation_subjectName_studentId_key` ON `SubjectEvaluation`(`subjectName`, `studentId`);
