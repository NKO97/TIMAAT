ALTER TABLE `fipop`.`user_password_old_hash` DROP FOREIGN KEY `fk_user_password_old_hash_user_password1`;
ALTER TABLE `fipop`.`user_password_old_hash` DROP INDEX `fk_user_password_old_hash_user_password1_idx`;
ALTER TABLE `fipop`.`user_password_old_hash` CHANGE `user_password_id` `user_account_id` INT(11) NOT NULL;
ALTER TABLE `fipop`.`user_password_old_hash` ADD CONSTRAINT `fk_user_password_old_hash_user_account1` FOREIGN KEY (`user_account_id`) REFERENCES `user_account`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX `fipop`.`fk_user_password_old_hash_user_account1_idx` ON `FIPOP`.`user_password_old_hash` (`user_account_id` ASC);

ALTER TABLE `fipop`.`user_password_old_hash` ADD `user_password_hash_type_id` INT NOT NULL AFTER `user_account_id`;
ALTER TABLE `fipop`.`user_password_old_hash` ADD CONSTRAINT `fk_user_password_old_hash_user_password_hash_type1` FOREIGN KEY (`user_password_hash_type_id`) REFERENCES `FIPOP`.`user_password_hash_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX `fipop`.`fk_user_password_old_hash_user_password_hash_type1_idx` ON `FIPOP`.`user_password_old_hash` (`user_password_hash_type_id` ASC);
