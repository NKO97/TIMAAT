ALTER TABLE `FIPOP`.`actor_person` ADD `citizenship` VARCHAR(100) NULL AFTER `title`, ADD `place_of_birth` VARCHAR(255) NULL AFTER `citizenship`, ADD `place_of_death` VARCHAR(255) NULL AFTER `place_of_birth`;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`music_dynamics_element_type`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`music_dynamics_element_type` (`id`) VALUES (14);

COMMIT;
-- -----------------------------------------------------
-- Data for table `FIPOP`.`music_dynamics_element_type_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`music_dynamics_element_type_translation` (`id`, `music_dynamics_element_type_id`, `language_id`, `type`) VALUES (14, 14, 1, 'niente');

COMMIT;