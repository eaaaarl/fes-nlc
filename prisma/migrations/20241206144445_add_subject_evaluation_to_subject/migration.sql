-- AlterTable
ALTER TABLE `subjectevaluation` ADD COLUMN `subjectId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `SubjectEvaluation` ADD CONSTRAINT `SubjectEvaluation_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
