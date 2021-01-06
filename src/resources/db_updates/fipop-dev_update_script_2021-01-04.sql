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