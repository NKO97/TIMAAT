START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (110, 'languageCreated');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (111, 'languageEdited');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (112, 'languageDeleted');
COMMIT;