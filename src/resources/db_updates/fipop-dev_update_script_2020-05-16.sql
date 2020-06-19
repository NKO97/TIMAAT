START TRANSACTION;
USE `FIPOP`;
DELETE FROM `FIPOP`.`role`;
INSERT INTO `FIPOP`.`role` (`id`, `dummy`) VALUES (1, NULL);
INSERT INTO `FIPOP`.`role` (`id`, `dummy`) VALUES (2, NULL);
INSERT INTO `FIPOP`.`role` (`id`, `dummy`) VALUES (3, NULL);
INSERT INTO `FIPOP`.`role` (`id`, `dummy`) VALUES (4, NULL);
INSERT INTO `FIPOP`.`role` (`id`, `dummy`) VALUES (5, NULL);
COMMIT;
ALTER TABLE `FIPOP`.`role` AUTO_INCREMENT=6;

START TRANSACTION;
USE `FIPOP`;
DELETE FROM `FIPOP`.`role_translation`;
INSERT INTO `FIPOP`.`role_translation` (`id`, `role_id`, `language_id`, `name`) VALUES (1, 1, 1, 'all');
INSERT INTO `FIPOP`.`role_translation` (`id`, `role_id`, `language_id`, `name`) VALUES (2, 2, 1, 'administrator');
INSERT INTO `FIPOP`.`role_translation` (`id`, `role_id`, `language_id`, `name`) VALUES (3, 3, 1, 'moderator');
INSERT INTO `FIPOP`.`role_translation` (`id`, `role_id`, `language_id`, `name`) VALUES (4, 4, 1, 'member');
INSERT INTO `FIPOP`.`role_translation` (`id`, `role_id`, `language_id`, `name`) VALUES (5, 5, 1, 'Producer');
COMMIT;
ALTER TABLE `FIPOP`.`role_translation` AUTO_INCREMENT=6;

START TRANSACTION;
USE `FIPOP`;
DELETE FROM `FIPOP`.`role_group`;
INSERT INTO `FIPOP`.`role_group` (`id`, `dummy`) VALUES (1, NULL);
INSERT INTO `FIPOP`.`role_group` (`id`, `dummy`) VALUES (2, NULL);
COMMIT;
ALTER TABLE `FIPOP`.`role_group` AUTO_INCREMENT=3;

START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`role_group_translation` (`id`, `role_group_id`, `language_id`, `name`) VALUES (1, 1, 1, 'Sioc Rights');
INSERT INTO `FIPOP`.`role_group_translation` (`id`, `role_group_id`, `language_id`, `name`) VALUES (2, 2, 1, 'Media Roles');
COMMIT;
ALTER TABLE `FIPOP`.`role_group_translation` AUTO_INCREMENT=3;

START TRANSACTION;
USE `FIPOP`;
DELETE FROM `FIPOP`.`role_group_has_role`;
INSERT INTO `FIPOP`.`role_group_has_role` (`role_group_id`, `role_id`) VALUES (1, 1);
INSERT INTO `FIPOP`.`role_group_has_role` (`role_group_id`, `role_id`) VALUES (1, 2);
INSERT INTO `FIPOP`.`role_group_has_role` (`role_group_id`, `role_id`) VALUES (1, 3);
INSERT INTO `FIPOP`.`role_group_has_role` (`role_group_id`, `role_id`) VALUES (1, 4);
INSERT INTO `FIPOP`.`role_group_has_role` (`role_group_id`, `role_id`) VALUES (2, 5);
COMMIT;