INSERT INTO `FIPOP`.`user_password` (`id`, `user_password_hash_type_id`, `salt`, `key_stretching_iterations`, `stretched_hash_encrypted`) VALUES (12, '1', 'salzigessalt', '8', '074cbcdaedb5bf1792c10213b04090f404d817357d596c7921d31afee5e60f5d')
INSERT INTO `FIPOP`.`user_password` (`id`, `user_password_hash_type_id`, `salt`, `key_stretching_iterations`, `stretched_hash_encrypted`) VALUES (13, '1', 'salzigessalt', '8', 'f534d6c6445e9b5fcad6dea856de3c705c0448c63d6e01ec06ce1317502ed3ee')

UPDATE `FIPOP`.`user_account` SET `user_account_status` = 'suspended' WHERE `user_account`.`id` = 4;
UPDATE `FIPOP`.`user_account` SET `user_account_status` = 'suspended' WHERE `user_account`.`id` = 10;
INSERT INTO `FIPOP`.`user_account` (`id`, `user_password_id`, `user_account_status`, `account_name`, `display_name`, `created_at`, `recovery_email_encrypted`, `content_access_rights`, `user_settings_web_interface`) VALUES (11, 12, 'active', 'test', 'Tester', '2017-12-01 01:00:00', 'foo@bar.de', NULL, NULL);
INSERT INTO `FIPOP`.`user_account` (`id`, `user_password_id`, `user_account_status`, `account_name`, `display_name`, `created_at`, `recovery_email_encrypted`, `content_access_rights`, `user_settings_web_interface`) VALUES (12, 13, 'active', 'lg', 'Lena Goeth', '2017-12-01 01:00:00', 'foo@bar.de', NULL, NULL);

ALTER TABLE `FIPOP`.`role` ADD `dummy` TINYINT(1) NULL AFTER `id`;

ALTER TABLE `FIPOP`.`role_group` ADD `dummy` TINYINT(1) NULL AFTER `id`;

ALTER TABLE `FIPOP`.`role_group_translation` CHANGE `name` `name` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL;

START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (104, 'roleCreated');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (105, 'roleEdited');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (106, 'roleDeleted');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (107, 'roleGroupCreated');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (108, 'roleGroupEdited');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (109, 'roleGroupDeleted');
COMMIT;
