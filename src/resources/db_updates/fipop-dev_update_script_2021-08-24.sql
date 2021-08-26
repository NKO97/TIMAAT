ALTER TABLE `FIPOP`.`media_collection` CHANGE `global_permission` `global_permission` TINYINT(2) NULL DEFAULT '0';
ALTER TABLE `FIPOP`.`media_collection` ADD `created_by_user_account_id` INT NOT NULL DEFAULT 1 AFTER `media_collection_type_id`;
ALTER TABLE `FIPOP`.`media_collection` ADD `last_edited_by_user_account_id` INT NULL AFTER `created_by_user_account_id`;
ALTER TABLE `FIPOP`.`media_collection` ADD `created_at` TIMESTAMP NOT NULL;
ALTER TABLE `FIPOP`.`media_collection` ADD `last_edited_at` TIMESTAMP NULL;
ALTER TABLE `FIPOP`.`media_collection` ADD CONSTRAINT `fk_media_collection_user_account1` FOREIGN KEY (`created_by_user_account_id`) REFERENCES `FIPOP`.`user_account` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`media_collection` ADD CONSTRAINT `fk_media_collection_user_account2` FOREIGN KEY (`last_edited_by_user_account_id`) REFERENCES `FIPOP`.`user_account` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

CREATE INDEX `fk_media_collection_user_account1_idx` ON `FIPOP`.`media_collection` (`created_by_user_account_id` ASC);

CREATE INDEX `fk_media_collection_user_account2_idx` ON `FIPOP`.`media_collection` (`last_edited_by_user_account_id` ASC);
