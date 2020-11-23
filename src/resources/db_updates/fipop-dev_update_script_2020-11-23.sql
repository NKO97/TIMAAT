-- -----------------------------------------------------
-- Data for table `FIPOP`.`user_password`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT IGNORE INTO `FIPOP`.`user_password` (`id`, `user_password_hash_type_id`, `salt`, `key_stretching_iterations`, `stretched_hash_encrypted`) VALUES (17, 1, 'salzigessalt', 8, 'a057bb67d7247668b9abfbacdb7a30116cbbfe274b8711c30bdb2a7486475732');

COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`user_account`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT IGNORE INTO `FIPOP`.`user_account` (`id`, `user_password_id`, `user_account_status`, `account_name`, `display_name`, `created_at`, `recovery_email_encrypted`, `content_access_rights`, `user_settings_web_interface`) VALUES (16, 17, 'active', 'mw', 'Michael W.', '2020-11-23 16:18:00', 'foo@bar.de', NULL, NULL);

COMMIT;