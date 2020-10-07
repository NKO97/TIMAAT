-- -----------------------------------------------------
-- Data for table `FIPOP`.`user_password`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT IGNORE INTO `FIPOP`.`user_password` (`id`, `user_password_hash_type_id`, `salt`, `key_stretching_iterations`, `stretched_hash_encrypted`) VALUES (16, 1, 'salzigessalt', 8, '2785b4149c3df37b1439acedda7932fd9ef7d74840eacdb193ddefca21b59225');

COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`user_account`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT IGNORE INTO `FIPOP`.`user_account` (`id`, `user_password_id`, `user_account_status`, `account_name`, `display_name`, `created_at`, `recovery_email_encrypted`, `content_access_rights`, `user_settings_web_interface`) VALUES (15, 16, 'active', 'ma', 'Majd Alkatreeb', '2020-10-07 01:00:00', 'foo@bar.de', NULL, NULL);

COMMIT;