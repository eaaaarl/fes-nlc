/*
  Warnings:

  - You are about to drop the column `plainTextPasswordId` on the `faculty` table. All the data in the column will be lost.
  - You are about to drop the column `plainTextPasswordId` on the `student` table. All the data in the column will be lost.
  - You are about to drop the `plaintextpassword` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `faculty` DROP FOREIGN KEY `Faculty_plainTextPasswordId_fkey`;

-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_plainTextPasswordId_fkey`;

-- AlterTable
ALTER TABLE `faculty` DROP COLUMN `plainTextPasswordId`;

-- AlterTable
ALTER TABLE `student` DROP COLUMN `plainTextPasswordId`;

-- DropTable
DROP TABLE `plaintextpassword`;
