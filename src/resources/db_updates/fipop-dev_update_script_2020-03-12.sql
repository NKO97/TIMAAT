START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (101, 'membershipCreated');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (102, 'membershipEdited');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (103, 'membershipDeleted');
COMMIT;