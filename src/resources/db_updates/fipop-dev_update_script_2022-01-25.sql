-- -----------------------------------------------------
-- Data for table `FIPOP`.`user_password`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`user_password` (`id`, `user_password_hash_type_id`, `salt`, `key_stretching_iterations`, `stretched_hash_encrypted`) VALUES (19, 1, 'salzigessalt', 8, 'c75f73f1d4b83f6eb15120ac5c308a47557244efc136d2af1945400759fa2fb0');

COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`user_account`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
UPDATE `FIPOP`.`user_account` SET `user_account_status` = 'suspended' WHERE `user_account`.`id` = 12;
INSERT INTO `FIPOP`.`user_account` (`id`, `user_password_id`, `user_account_status`, `account_name`, `display_name`, `created_at`, `recovery_email_encrypted`, `content_access_rights`, `user_settings_web_interface`) VALUES (18, 19, 'active', 'mz', 'Marlene Ziegelmayer', '2022-01-25 17:57:00', 'foo@bar.de', NULL, NULL);

COMMIT;