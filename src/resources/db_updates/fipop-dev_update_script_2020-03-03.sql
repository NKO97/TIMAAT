START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`location` (`id`, `location_type_id`, `parent_location_id`, `created_by_user_account_id`, `last_edited_by_user_account_id`, `created_at`, `last_edited_at`) VALUES (281, 4, NULL, 1, NULL, '2017-06-01 00:00:00', NULL);
INSERT INTO `FIPOP`.`location` (`id`, `location_type_id`, `parent_location_id`, `created_by_user_account_id`, `last_edited_by_user_account_id`, `created_at`, `last_edited_at`) VALUES (282, 5, NULL, 1, NULL, '2017-06-01 00:00:00', NULL);
COMMIT;

START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`location_translation` (`id`, `location_id`, `language_id`, `name`) VALUES (281, 281, 1, 'TEMP CITY');
INSERT INTO `FIPOP`.`location_translation` (`id`, `location_id`, `language_id`, `name`) VALUES (282, 282, 1, 'TEMP STREET');

COMMIT;

START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`city` (`location_id`) VALUES (281);
COMMIT;

START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`street` (`location_id`) VALUES (282);
COMMIT;