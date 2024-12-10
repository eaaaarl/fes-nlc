-- AlterTable
ALTER TABLE `evaluation` ADD COLUMN `comments` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `ratingscale` MODIFY `description` VARCHAR(191) NULL;
