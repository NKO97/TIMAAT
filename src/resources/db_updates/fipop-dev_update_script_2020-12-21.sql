-- -----------------------------------------------------
-- Data for table `FIPOP`.`user_password`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT IGNORE INTO `FIPOP`.`user_password` (`id`, `user_password_hash_type_id`, `salt`, `key_stretching_iterations`, `stretched_hash_encrypted`) VALUES (18, 1, 'salzigessalt', 8, 'e58d24274462bec110d412483600c3343f54e159159cc17eac5662e3a28bebc0');

COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`user_account`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT IGNORE INTO `FIPOP`.`user_account` (`id`, `user_password_id`, `user_account_status`, `account_name`, `display_name`, `created_at`, `recovery_email_encrypted`, `content_access_rights`, `user_settings_web_interface`) VALUES (17, 18, 'active', 'spütz', 'Sabrina Pütz', '2020-12-21 10:18:00', 'foo@bar.de', NULL, NULL);

COMMIT;