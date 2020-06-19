START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (104, 'roleCreated');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (105, 'roleEdited');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (106, 'roleDeleted');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (107, 'roleGroupCreated');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (108, 'roleGroupEdited');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (109, 'roleGroupDeleted');
COMMIT;

ALTER TABLE `role` ADD `dummy` TINYINT(1) NULL AFTER `id`;

ALTER TABLE `role_group` ADD `dummy` TINYINT(1) NULL AFTER `id`;

ALTER TABLE `role_group_translation` CHANGE `name` `name` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL;