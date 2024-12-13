/*
  Warnings:

  - The primary key for the `faculty` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `student` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `_facultysubjects` DROP FOREIGN KEY `_FacultySubjects_A_fkey`;

-- DropForeignKey
ALTER TABLE `_studentsubjects` DROP FOREIGN KEY `_StudentSubjects_A_fkey`;

-- DropForeignKey
ALTER TABLE `evaluation` DROP FOREIGN KEY `Evaluation_facultyId_fkey`;

-- DropForeignKey
ALTER TABLE `subjectevaluation` DROP FOREIGN KEY `SubjectEvaluation_studentId_fkey`;

-- AlterTable
ALTER TABLE `_facultysubjects` MODIFY `A` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `_studentsubjects` MODIFY `A` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `evaluation` MODIFY `facultyId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `faculty` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `student` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `subjectevaluation` MODIFY `studentId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `SubjectEvaluation` ADD CONSTRAINT `SubjectEvaluation_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_facultyId_fkey` FOREIGN KEY (`facultyId`) REFERENCES `Faculty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FacultySubjects` ADD CONSTRAINT `_FacultySubjects_A_fkey` FOREIGN KEY (`A`) REFERENCES `Faculty`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_StudentSubjects` ADD CONSTRAINT `_StudentSubjects_A_fkey` FOREIGN KEY (`A`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
