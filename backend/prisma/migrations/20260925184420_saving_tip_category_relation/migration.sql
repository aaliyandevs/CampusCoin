-- AddForeignKey
ALTER TABLE `saving_tips` ADD CONSTRAINT `saving_tips_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
