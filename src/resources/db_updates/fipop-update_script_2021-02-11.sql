-- -----------------------------------------------------
-- Table `FIPOP`.`analysis_scene`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`analysis_scene` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `analysis_segment_id` INT NOT NULL,
  `start_time` INT(11) NOT NULL,
  `end_time` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_analysis_scene_analysis_segment1`
    FOREIGN KEY (`analysis_segment_id`)
    REFERENCES `FIPOP`.`analysis_segment` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_analysis_scene_analysis_segment1_idx` ON `FIPOP`.`analysis_scene` (`analysis_segment_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`analysis_scene_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`analysis_scene_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `analysis_scene_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `short_description` VARCHAR(255) NULL,
  `comment` VARCHAR(4096) NULL,
  `transcript` TEXT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_analysis_scene_translation_analysis_scene1`
    FOREIGN KEY (`analysis_scene_id`)
    REFERENCES `FIPOP`.`analysis_scene` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_analysis_scene_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_analysis_scene_translation_analysis_scene1_idx` ON `FIPOP`.`analysis_scene_translation` (`analysis_scene_id` ASC);

CREATE INDEX `fk_analysis_scene_translation_language1_idx` ON `FIPOP`.`analysis_scene_translation` (`language_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`analysis_action`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`analysis_action` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `analysis_scene_id` INT NOT NULL,
  `start_time` INT(11) NOT NULL,
  `end_time` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_analysis_action_analysis_scene1`
    FOREIGN KEY (`analysis_scene_id`)
    REFERENCES `FIPOP`.`analysis_scene` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_analysis_action_analysis_scene1_idx` ON `FIPOP`.`analysis_action` (`analysis_scene_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`analysis_action_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`analysis_action_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `analysis_action_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `short_description` VARCHAR(255) NULL,
  `comment` VARCHAR(4096) NULL,
  `transcript` TEXT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_analysis_action_translation_analysis_action1`
    FOREIGN KEY (`analysis_action_id`)
    REFERENCES `FIPOP`.`analysis_action` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_analysis_action_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_analysis_action_translation_analysis_action1_idx` ON `FIPOP`.`analysis_action_translation` (`analysis_action_id` ASC);

CREATE INDEX `fk_analysis_action_translation_language1_idx` ON `FIPOP`.`analysis_action_translation` (`language_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`analysis_sequence`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`analysis_sequence` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `analysis_segment_id` INT NOT NULL,
  `start_time` INT(11) NOT NULL,
  `end_time` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_analysis_sequence_analysis_segment1`
    FOREIGN KEY (`analysis_segment_id`)
    REFERENCES `FIPOP`.`analysis_segment` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_analysis_sequence_analysis_segment1_idx` ON `FIPOP`.`analysis_sequence` (`analysis_segment_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`analysis_sequence_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`analysis_sequence_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `analysis_sequence_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `short_description` VARCHAR(255) NULL,
  `comment` VARCHAR(4096) NULL,
  `transcript` TEXT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_analysis_sequence_translation_analysis_sequence1`
    FOREIGN KEY (`analysis_sequence_id`)
    REFERENCES `FIPOP`.`analysis_sequence` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_analysis_sequence_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_analysis_sequence_translation_analysis_sequence1_idx` ON `FIPOP`.`analysis_sequence_translation` (`analysis_sequence_id` ASC);

CREATE INDEX `fk_analysis_sequence_translation_language1_idx` ON `FIPOP`.`analysis_sequence_translation` (`language_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`analysis_take`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`analysis_take` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `analysis_sequence_id` INT NOT NULL,
  `start_time` INT(11) NOT NULL,
  `end_time` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_analysis_take_analysis_sequence1`
    FOREIGN KEY (`analysis_sequence_id`)
    REFERENCES `FIPOP`.`analysis_sequence` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_analysis_take_analysis_sequence1_idx` ON `FIPOP`.`analysis_take` (`analysis_sequence_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`analysis_take_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`analysis_take_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `analysis_take_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `short_description` VARCHAR(255) NULL,
  `comment` VARCHAR(4096) NULL,
  `transcript` TEXT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_analysis_take_translation_analysis_take1`
    FOREIGN KEY (`analysis_take_id`)
    REFERENCES `FIPOP`.`analysis_take` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_analysis_take_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_analysis_take_translation_analysis_take1_idx` ON `FIPOP`.`analysis_take_translation` (`analysis_take_id` ASC);

CREATE INDEX `fk_analysis_take_translation_language1_idx` ON `FIPOP`.`analysis_take_translation` (`language_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`medium_has_category_set`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`medium_has_category_set` (
  `medium_id` INT NOT NULL,
  `category_set_id` INT NOT NULL,
  PRIMARY KEY (`medium_id`, `category_set_id`),
  CONSTRAINT `fk_medium_has_category_set_medium1`
    FOREIGN KEY (`medium_id`)
    REFERENCES `FIPOP`.`medium` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_medium_has_category_set_category_set1`
    FOREIGN KEY (`category_set_id`)
    REFERENCES `FIPOP`.`category_set` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_medium_has_category_set_category_set1_idx` ON `FIPOP`.`medium_has_category_set` (`category_set_id` ASC);
CREATE INDEX `fk_medium_has_category_set_medium1_idx` ON `FIPOP`.`medium_has_category_set` (`medium_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`analysis_action_has_category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`analysis_action_has_category` (
  `analysis_action_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  PRIMARY KEY (`analysis_action_id`, `category_id`),
  CONSTRAINT `fk_analysis_action_has_category_analysis_action1`
    FOREIGN KEY (`analysis_action_id`)
    REFERENCES `FIPOP`.`analysis_action` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_analysis_action_has_category_category1`
    FOREIGN KEY (`category_id`)
    REFERENCES `FIPOP`.`category` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_analysis_action_has_category_category1_idx` ON `FIPOP`.`analysis_action_has_category` (`category_id` ASC);
CREATE INDEX `fk_analysis_action_has_category_analysis_action1_idx` ON `FIPOP`.`analysis_action_has_category` (`analysis_action_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`analysis_scene_has_category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`analysis_scene_has_category` (
  `analysis_scene_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  PRIMARY KEY (`analysis_scene_id`, `category_id`),
  CONSTRAINT `fk_analysis_scene_has_category_analysis_scene1`
    FOREIGN KEY (`analysis_scene_id`)
    REFERENCES `FIPOP`.`analysis_scene` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_analysis_scene_has_category_category1`
    FOREIGN KEY (`category_id`)
    REFERENCES `FIPOP`.`category` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_analysis_scene_has_category_category1_idx` ON `FIPOP`.`analysis_scene_has_category` (`category_id` ASC);
CREATE INDEX `fk_analysis_scene_has_category_analysis_scene1_idx` ON `FIPOP`.`analysis_scene_has_category` (`analysis_scene_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`analysis_segment_has_category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`analysis_segment_has_category` (
  `analysis_segment_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  PRIMARY KEY (`analysis_segment_id`, `category_id`),
  CONSTRAINT `fk_analysis_segment_has_category_analysis_segment1`
    FOREIGN KEY (`analysis_segment_id`)
    REFERENCES `FIPOP`.`analysis_segment` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_analysis_segment_has_category_category1`
    FOREIGN KEY (`category_id`)
    REFERENCES `FIPOP`.`category` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_analysis_segment_has_category_category1_idx` ON `FIPOP`.`analysis_segment_has_category` (`category_id` ASC);
CREATE INDEX `fk_analysis_segment_has_category_analysis_segment1_idx` ON `FIPOP`.`analysis_segment_has_category` (`analysis_segment_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`analysis_sequence_has_category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`analysis_sequence_has_category` (
  `analysis_sequence_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  PRIMARY KEY (`analysis_sequence_id`, `category_id`),
  CONSTRAINT `fk_analysis_sequence_has_category_analysis_sequence1`
    FOREIGN KEY (`analysis_sequence_id`)
    REFERENCES `FIPOP`.`analysis_sequence` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_analysis_sequence_has_category_category1`
    FOREIGN KEY (`category_id`)
    REFERENCES `FIPOP`.`category` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_analysis_sequence_has_category_category1_idx` ON `FIPOP`.`analysis_sequence_has_category` (`category_id` ASC);
CREATE INDEX `fk_analysis_sequence_has_category_analysis_sequence1_idx` ON `FIPOP`.`analysis_sequence_has_category` (`analysis_sequence_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`analysis_take_has_category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`analysis_take_has_category` (
  `analysis_take_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  PRIMARY KEY (`analysis_take_id`, `category_id`),
  CONSTRAINT `fk_analysis_take_has_category_analysis_take1`
    FOREIGN KEY (`analysis_take_id`)
    REFERENCES `FIPOP`.`analysis_take` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_analysis_take_has_category_category1`
    FOREIGN KEY (`category_id`)
    REFERENCES `FIPOP`.`category` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_analysis_take_has_category_category1_idx` ON `FIPOP`.`analysis_take_has_category` (`category_id` ASC);
CREATE INDEX `fk_analysis_take_has_category_analysis_take1_idx` ON `FIPOP`.`analysis_take_has_category` (`analysis_take_id` ASC);


START TRANSACTION;
USE `FIPOP`;
INSERT IGNORE INTO `FIPOP`.`user_password` (`id`, `user_password_hash_type_id`, `salt`, `key_stretching_iterations`, `stretched_hash_encrypted`) VALUES (17, 1, 'salzigessalt', 8, 'a057bb67d7247668b9abfbacdb7a30116cbbfe274b8711c30bdb2a7486475732');
INSERT IGNORE INTO `FIPOP`.`user_password` (`id`, `user_password_hash_type_id`, `salt`, `key_stretching_iterations`, `stretched_hash_encrypted`) VALUES (18, 1, 'salzigessalt', 8, 'e58d24274462bec110d412483600c3343f54e159159cc17eac5662e3a28bebc0');
COMMIT;


START TRANSACTION;
USE `FIPOP`;
INSERT IGNORE INTO `FIPOP`.`user_account` (`id`, `user_password_id`, `user_account_status`, `account_name`, `display_name`, `created_at`, `recovery_email_encrypted`, `content_access_rights`, `user_settings_web_interface`) VALUES (16, 17, 'suspended', 'mw', 'Michael W.', '2020-11-23 16:18:00', 'foo@bar.de', NULL, NULL);
INSERT IGNORE INTO `FIPOP`.`user_account` (`id`, `user_password_id`, `user_account_status`, `account_name`, `display_name`, `created_at`, `recovery_email_encrypted`, `content_access_rights`, `user_settings_web_interface`) VALUES (17, 18, 'active', 'spütz', 'Sabrina Pütz', '2020-12-21 10:18:00', 'foo@bar.de', NULL, NULL);
COMMIT;

START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (113, 'analysisSequenceCreated');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (114, 'analysisSequenceEdited');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (115, 'analysisSequenceDeleted');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (116, 'analysisSceneCreated');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (117, 'analysisSceneEdited');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (118, 'analysisSceneDeleted');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (119, 'analysisActionCreated');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (120, 'analysisActionEdited');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (121, 'analysisActionDeleted');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (122, 'analysisTakeCreated');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (123, 'analysisTakeEdited');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (124, 'analysisTakeDeleted');
COMMIT;

ALTER TABLE `FIPOP`.`annotation` CHANGE `sequence_start_time` `start_time` INT(11) NULL DEFAULT NULL;
ALTER TABLE `FIPOP`.`annotation` CHANGE `sequence_end_time` `end_time` INT(11) NULL DEFAULT NULL;

ALTER TABLE `FIPOP`.`analysis_segment` CHANGE `segment_start_time` `start_time` INT(11) NULL DEFAULT NULL;
ALTER TABLE `FIPOP`.`analysis_segment` CHANGE `segment_end_time` `end_time` INT(11) NULL DEFAULT NULL;

ALTER TABLE `FIPOP`.`analysis_segment_translation` CHANGE `title` `name` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL;
ALTER TABLE `FIPOP`.`analysis_segment_translation` ADD `transcript` TEXT NULL AFTER `comment`;

ALTER TABLE `FIPOP`.`medium` ADD `recording_start_date` DATE NULL AFTER `release_date`;
ALTER TABLE `FIPOP`.`medium` ADD `recording_end_date` DATE NULL AFTER `recording_start_date`;

ALTER TABLE `FIPOP`.`medium_has_title` DROP FOREIGN KEY `fk_medium_has_title_title1`;
ALTER TABLE `FIPOP`.`medium_has_title` ADD CONSTRAINT `fk_medium_has_title_title1` FOREIGN KEY (`title_id`) REFERENCES `FIPOP`.`title` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `medium_has_category` DROP FOREIGN KEY `fk_medium_has_category_category1`; 
ALTER TABLE `medium_has_category` ADD CONSTRAINT `fk_medium_has_category_category1` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION; ALTER TABLE `medium_has_category` DROP FOREIGN KEY `fk_medium_has_category_medium1`; ALTER TABLE `medium_has_category` ADD CONSTRAINT `fk_medium_has_category_medium1` FOREIGN KEY (`medium_id`) REFERENCES `medium`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
