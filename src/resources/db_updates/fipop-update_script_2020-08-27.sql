ALTER TABLE `FIPOP`.`medium_image` CHANGE `width` `width` INT NOT NULL;
ALTER TABLE `FIPOP`.`medium_image` CHANGE `height` `height` INT NOT NULL;

CREATE TABLE IF NOT EXISTS `FIPOP`.`actor_has_medium_image` (
  `actor_id` INT NOT NULL,
  `medium_image_medium_id` INT NOT NULL,
  PRIMARY KEY (`actor_id`, `medium_image_medium_id`),
  CONSTRAINT `fk_actor_has_medium_image_actor1`
    FOREIGN KEY (`actor_id`)
    REFERENCES `FIPOP`.`actor` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_actor_has_medium_image_medium_image1`
    FOREIGN KEY (`medium_image_medium_id`)
    REFERENCES `FIPOP`.`medium_image` (`medium_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_actor_has_medium_image_medium_image1_idx` ON `FIPOP`.`actor_has_medium_image` (`medium_image_medium_id` ASC);
CREATE INDEX `fk_actor_has_medium_image_actor1_idx` ON `FIPOP`.`actor_has_medium_image` (`actor_id` ASC);

START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (110, 'languageCreated');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (111, 'languageEdited');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (112, 'languageDeleted');
COMMIT;

START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`language` (`id`, `code`, `name`, `is_system_language`) VALUES (NULL, 'tr', 'Turkish', '0');
INSERT INTO `FIPOP`.`language` (`id`, `code`, `name`, `is_system_language`) VALUES (NULL, 'ku', 'Kurdish', '0');
INSERT INTO `FIPOP`.`language` (`id`, `code`, `name`, `is_system_language`) VALUES (NULL, 'ug', 'Uighur', '0');
INSERT INTO `FIPOP`.`language` (`id`, `code`, `name`, `is_system_language`) VALUES (NULL, 'zh', 'Chinese', '0');
INSERT INTO `FIPOP`.`language` (`id`, `code`, `name`, `is_system_language`) VALUES (NULL, 'bn', 'Bengali', '0');
INSERT INTO `FIPOP`.`language` (`id`, `code`, `name`, `is_system_language`) VALUES (NULL, 'pt', 'Portuguese', '0');
INSERT INTO `FIPOP`.`language` (`id`, `code`, `name`, `is_system_language`) VALUES (NULL, 'dv', 'Divehi', '0');
COMMIT;

ALTER TABLE `FIPOP`.`analysis_segment_translation` CHANGE `name` `title` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL;
ALTER TABLE `FIPOP`.`analysis_segment_translation` ADD `short_description` VARCHAR(255) NULL AFTER `title`, ADD `comment` VARCHAR(4096) NULL AFTER `short_description`;

UPDATE `FIPOP`.`language` SET `name` = 'unknown' WHERE `language`.`id` = 1;

ALTER TABLE `FIPOP`.`medium_analysis_list_translation` DROP INDEX `title_UNIQUE`;
