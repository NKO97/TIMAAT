ALTER TABLE `FIPOP`.`analysis_segment` CHANGE `start_time` `start_time` INT(11) NOT NULL;
ALTER TABLE `FIPOP`.`analysis_segment` CHANGE `end_time` `end_time` INT(11) NOT NULL;
ALTER TABLE `FIPOP`.`annotation` CHANGE `start_time` `start_time` INT(11) NOT NULL;
ALTER TABLE `FIPOP`.`annotation` CHANGE `end_time` `end_time` INT(11) NOT NULL;

-- -----------------------------------------------------
-- Table `FIPOP`.`editing_rhythm`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`editing_rhythm` (
  `analysis_method_id` INT NOT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_editing_rhythm_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FIPOP`.`editing_rhythm_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`editing_rhythm_translation` (
  `id` INT NOT NULL,
  `editing_rhythm_analysis_method_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_editing_rhythm_translation_editing_rhythm1`
    FOREIGN KEY (`editing_rhythm_analysis_method_id`)
    REFERENCES `FIPOP`.`editing_rhythm` (`analysis_method_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_editing_rhythm_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_editing_rhythm_translation_editing_rhythm1_idx` ON `FIPOP`.`editing_rhythm_translation` (`editing_rhythm_analysis_method_id` ASC);

CREATE INDEX `fk_editing_rhythm_translation_language1_idx` ON `FIPOP`.`editing_rhythm_translation` (`language_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`image_cadre_editing`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`image_cadre_editing` (
  `analysis_method_id` INT NOT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_image_cadre_editing_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FIPOP`.`image_cadre_editing_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`image_cadre_editing_translation` (
  `id` INT NOT NULL,
  `image_cadre_editing_analysis_method_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_image_cadre_editing_translation_image_cadre_editing1`
    FOREIGN KEY (`image_cadre_editing_analysis_method_id`)
    REFERENCES `FIPOP`.`image_cadre_editing` (`analysis_method_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_image_cadre_editing_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_image_cadre_editing_translation_image_cadre_editing1_idx` ON `FIPOP`.`image_cadre_editing_translation` (`image_cadre_editing_analysis_method_id` ASC);

CREATE INDEX `fk_image_cadre_editing_translation_language1_idx` ON `FIPOP`.`image_cadre_editing_translation` (`language_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`montage_figure_macro`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`montage_figure_macro` (
  `analysis_method_id` INT NOT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_montage_figure_macro_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FIPOP`.`montage_figure_macro_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`montage_figure_macro_translation` (
  `id` INT NOT NULL,
  `montage_figure_macro_analysis_method_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_montage_figure_macro_translation_montage_figure_macro1`
    FOREIGN KEY (`montage_figure_macro_analysis_method_id`)
    REFERENCES `FIPOP`.`montage_figure_macro` (`analysis_method_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_montage_figure_macro_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_montage_figure_macro_translation_montage_figure_macro1_idx` ON `FIPOP`.`montage_figure_macro_translation` (`montage_figure_macro_analysis_method_id` ASC);

CREATE INDEX `fk_montage_figure_macro_translation_language1_idx` ON `FIPOP`.`montage_figure_macro_translation` (`language_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`montage_figure_micro`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`montage_figure_micro` (
  `analysis_method_id` INT NOT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_montage_figure_micro_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FIPOP`.`montage_figure_micro_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`montage_figure_micro_translation` (
  `id` INT NOT NULL,
  `montage_figure_micro_analysis_method_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_montage_figure_micro_translation_montage_figure_micro1`
    FOREIGN KEY (`montage_figure_micro_analysis_method_id`)
    REFERENCES `FIPOP`.`montage_figure_micro` (`analysis_method_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_montage_figure_micro_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_montage_figure_micro_translation_montage_figure_micro1_idx` ON `FIPOP`.`montage_figure_micro_translation` (`montage_figure_micro_analysis_method_id` ASC);

CREATE INDEX `fk_montage_figure_micro_translation_language1_idx` ON `FIPOP`.`montage_figure_micro_translation` (`language_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`playback_speed`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`playback_speed` (
  `analysis_method_id` INT NOT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_playback_speed_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FIPOP`.`playback_speed_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`playback_speed_translation` (
  `id` INT NOT NULL,
  `playback_speed_analysis_method_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_playback_speed_translation_playback_speed1`
    FOREIGN KEY (`playback_speed_analysis_method_id`)
    REFERENCES `FIPOP`.`playback_speed` (`analysis_method_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_playback_speed_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_playback_speed_translation_playback_speed1_idx` ON `FIPOP`.`playback_speed_translation` (`playback_speed_analysis_method_id` ASC);

CREATE INDEX `fk_playback_speed_translation_language1_idx` ON `FIPOP`.`playback_speed_translation` (`language_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`take_junction`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`take_junction` (
  `analysis_method_id` INT NOT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_take_junction_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FIPOP`.`take_junction_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`take_junction_translation` (
  `id` INT NOT NULL,
  `take_junction_analysis_method_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_take_junction_translation_take_junction1`
    FOREIGN KEY (`take_junction_analysis_method_id`)
    REFERENCES `FIPOP`.`take_junction` (`analysis_method_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_take_junction_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_take_junction_translation_take_junction1_idx` ON `FIPOP`.`take_junction_translation` (`take_junction_analysis_method_id` ASC);

CREATE INDEX `fk_take_junction_translation_language1_idx` ON `FIPOP`.`take_junction_translation` (`language_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`take_length`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`take_length` (
  `analysis_method_id` INT NOT NULL,
  `text` TEXT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_take_length_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FIPOP`.`take_type_progression`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`take_type_progression` (
  `analysis_method_id` INT NOT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_take_type_progression_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FIPOP`.`take_type_progression_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`take_type_progression_translation` (
  `id` INT NOT NULL,
  `take_type_progression_analysis_method_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_take_type_progression_translation_take_type_progression1`
    FOREIGN KEY (`take_type_progression_analysis_method_id`)
    REFERENCES `FIPOP`.`take_type_progression` (`analysis_method_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_take_type_progression_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_take_type_progression_translation_take_type_progressio1_idx` ON `FIPOP`.`take_type_progression_translation` (`take_type_progression_analysis_method_id` ASC);

CREATE INDEX `fk_take_type_progression_translation_language1_idx` ON `FIPOP`.`take_type_progression_translation` (`language_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`editing_montage`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`editing_montage` (
  `analysis_method_id` INT NOT NULL,
  `montage_figure_macro_analysis_method_id` INT NULL,
  `montage_figure_micro_analysis_method_id` INT NULL,
  `take_junction_analysis_method_id` INT NULL,
  `editing_rhythm_analysis_method_id` INT NULL,
  `take_length_analysis_method_id` INT NULL,
  `take_type_progression_analysis_method_id` INT NULL,
  `camera_shot_type_analysis_method_id` INT NULL,
  `playback_speed_analysis_method_id` INT NULL,
  `image_cadre_editing_analysis_method_id` INT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_editing_montage_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_editing_montage_montage_figure_macro1`
    FOREIGN KEY (`montage_figure_macro_analysis_method_id`)
    REFERENCES `FIPOP`.`montage_figure_macro` (`analysis_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_editing_montage_montage_figure_micro1`
    FOREIGN KEY (`montage_figure_micro_analysis_method_id`)
    REFERENCES `FIPOP`.`montage_figure_micro` (`analysis_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_editing_montage_take_junction1`
    FOREIGN KEY (`take_junction_analysis_method_id`)
    REFERENCES `FIPOP`.`take_junction` (`analysis_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_editing_montage_editing_rhythm1`
    FOREIGN KEY (`editing_rhythm_analysis_method_id`)
    REFERENCES `FIPOP`.`editing_rhythm` (`analysis_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_editing_montage_take_length1`
    FOREIGN KEY (`take_length_analysis_method_id`)
    REFERENCES `FIPOP`.`take_length` (`analysis_method_id`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_editing_montage_take_type_progression1`
    FOREIGN KEY (`take_type_progression_analysis_method_id`)
    REFERENCES `FIPOP`.`take_type_progression` (`analysis_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_editing_montage_camera_shot_type1`
    FOREIGN KEY (`camera_shot_type_analysis_method_id`)
    REFERENCES `FIPOP`.`camera_shot_type` (`analysis_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_editing_montage_playback_speed1`
    FOREIGN KEY (`playback_speed_analysis_method_id`)
    REFERENCES `FIPOP`.`playback_speed` (`analysis_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_editing_montage_image_cadre_editing1`
    FOREIGN KEY (`image_cadre_editing_analysis_method_id`)
    REFERENCES `FIPOP`.`image_cadre_editing` (`analysis_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_editing_montage_montage_figure_macro1_idx` ON `FIPOP`.`editing_montage` (`montage_figure_macro_analysis_method_id` ASC);

CREATE INDEX `fk_editing_montage_montage_figure_micro1_idx` ON `FIPOP`.`editing_montage` (`montage_figure_micro_analysis_method_id` ASC);

CREATE INDEX `fk_editing_montage_take_junction1_idx` ON `FIPOP`.`editing_montage` (`take_junction_analysis_method_id` ASC);

CREATE INDEX `fk_editing_montage_editing_rhythm1_idx` ON `FIPOP`.`editing_montage` (`editing_rhythm_analysis_method_id` ASC);

CREATE INDEX `fk_editing_montage_take_length1_idx` ON `FIPOP`.`editing_montage` (`take_length_analysis_method_id` ASC);

CREATE INDEX `fk_editing_montage_take_type_progression1_idx` ON `FIPOP`.`editing_montage` (`take_type_progression_analysis_method_id` ASC);

CREATE INDEX `fk_editing_montage_camera_shot_type1_idx` ON `FIPOP`.`editing_montage` (`camera_shot_type_analysis_method_id` ASC);

CREATE INDEX `fk_editing_montage_playback_speed1_idx` ON `FIPOP`.`editing_montage` (`playback_speed_analysis_method_id` ASC);

CREATE INDEX `fk_editing_montage_image_cadre_editing1_idx` ON `FIPOP`.`editing_montage` (`image_cadre_editing_analysis_method_id` ASC);


SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

DROP TABLE IF EXISTS `FIPOP`.`camera_movement_characteristic_translation`;
DROP TABLE IF EXISTS `FIPOP`.`camera_movement_characteristic`;
DROP TABLE IF EXISTS `FIPOP`.`concept_direction_translation`;
DROP TABLE IF EXISTS `FIPOP`.`concept_direction`;
DROP TABLE IF EXISTS `FIPOP`.`camera_movement`;
DROP TABLE IF EXISTS `FIPOP`.`camera_movement_translation`;

-- -----------------------------------------------------
-- Table `FIPOP`.`camera_movement_characteristic`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`camera_movement_characteristic` (
  `analysis_method_id` INT NOT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_camera_movement_characteristic_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_camera_movement_characteristic_analysis_method1_idx` ON `FIPOP`.`camera_movement_characteristic` (`analysis_method_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`camera_movement_characteristic_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`camera_movement_characteristic_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `camera_movement_characteristic_analysis_method_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_camera_movement_characteristic_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_camera_movement_characteristic_translation_camera_movement1`
    FOREIGN KEY (`camera_movement_characteristic_analysis_method_id`)
    REFERENCES `FIPOP`.`camera_movement_characteristic` (`analysis_method_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_camera_movement_characteristic_translation_language1_idx` ON `FIPOP`.`camera_movement_characteristic_translation` (`language_id` ASC);

CREATE INDEX `fk_camera_movement_characteristic_translation_camera_moveme_idx` ON `FIPOP`.`camera_movement_characteristic_translation` (`camera_movement_characteristic_analysis_method_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`concept_direction`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`concept_direction` (
  `analysis_method_id` INT NOT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_concept_direction_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_concept_direction_analysis_method1_idx` ON `FIPOP`.`concept_direction` (`analysis_method_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`concept_direction_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`concept_direction_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `concept_direction_analysis_method_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_concept_direction_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_concept_direction_translation_concept_direction1`
    FOREIGN KEY (`concept_direction_analysis_method_id`)
    REFERENCES `FIPOP`.`concept_direction` (`analysis_method_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_concept_direction_translation_language1_idx` ON `FIPOP`.`concept_direction_translation` (`language_id` ASC);

CREATE INDEX `fk_concept_direction_translation_concept_direction1_idx` ON `FIPOP`.`concept_direction_translation` (`concept_direction_analysis_method_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`camera_movement_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`camera_movement_type` (
  `analysis_method_id` INT NOT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_camera_movement_type_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FIPOP`.`camera_movement_type_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`camera_movement_type_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `camera_movement_type_analysis_method_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_camera_movement_type_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_camera_movement_type_translation_camera_movement_type1`
    FOREIGN KEY (`camera_movement_type_analysis_method_id`)
    REFERENCES `FIPOP`.`camera_movement_type` (`analysis_method_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_camera_movement_translation_language1_idx` ON `FIPOP`.`camera_movement_type_translation` (`language_id` ASC);

CREATE INDEX `fk_camera_movement_type_translation_camera_movement_type1_idx` ON `FIPOP`.`camera_movement_type_translation` (`camera_movement_type_analysis_method_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`camera_movement`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`camera_movement` (
  `analysis_method_id` INT NOT NULL,
  `camera_movement_type_analysis_method_id` INT NULL,
  `camera_movement_characteristic_analysis_method_id` INT NULL,
  `concept_direction_analysis_method_id` INT NULL,
  `start_concept_camera_position_and_perspective_analysis_method_id` INT NULL,
  `end_concept_camera_position_and_perspective_analysis_method_id` INT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_camera_movement_concept_camera_position_and_perspective1`
    FOREIGN KEY (`start_concept_camera_position_and_perspective_analysis_method_id`)
    REFERENCES `FIPOP`.`concept_camera_position_and_perspective` (`analysis_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_camera_movement_concept_camera_position_and_perspective2`
    FOREIGN KEY (`end_concept_camera_position_and_perspective_analysis_method_id`)
    REFERENCES `FIPOP`.`concept_camera_position_and_perspective` (`analysis_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_camera_movement_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_camera_movement_concept_direction1`
    FOREIGN KEY (`concept_direction_analysis_method_id`)
    REFERENCES `FIPOP`.`concept_direction` (`analysis_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_camera_movement_camera_movement_characteristic1`
    FOREIGN KEY (`camera_movement_characteristic_analysis_method_id`)
    REFERENCES `FIPOP`.`camera_movement_characteristic` (`analysis_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_camera_movement_camera_movement_type1`
    FOREIGN KEY (`camera_movement_type_analysis_method_id`)
    REFERENCES `FIPOP`.`camera_movement_type` (`analysis_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_camera_movement_concept_camera_position_and_perspective1_idx` ON `FIPOP`.`camera_movement` (`start_concept_camera_position_and_perspective_analysis_method_id` ASC);

CREATE INDEX `fk_camera_movement_concept_camera_position_and_perspective2_idx` ON `FIPOP`.`camera_movement` (`end_concept_camera_position_and_perspective_analysis_method_id` ASC);

CREATE INDEX `fk_camera_movement_analysis_method1_idx` ON `FIPOP`.`camera_movement` (`analysis_method_id` ASC);

CREATE INDEX `fk_camera_movement_concept_direction1_idx` ON `FIPOP`.`camera_movement` (`concept_direction_analysis_method_id` ASC);

CREATE INDEX `fk_camera_movement_camera_movement_characteristic1_idx` ON `FIPOP`.`camera_movement` (`camera_movement_characteristic_analysis_method_id` ASC);

CREATE INDEX `fk_camera_movement_camera_movement_type1_idx` ON `FIPOP`.`camera_movement` (`camera_movement_type_analysis_method_id` ASC);



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


DROP TABLE IF EXISTS `FIPOP`.`concept_camera_movement_and_handling`;

ALTER TABLE `FIPOP`.`camera_movement` ADD `camera_handling_analysis_method_id` INT(11) NULL AFTER `camera_movement_characteristic_analysis_method_id`;
ALTER TABLE `FIPOP`.`camera_movement` ADD CONSTRAINT `fk_camera_movement_camera_handling1` FOREIGN KEY (`camera_handling_analysis_method_id`) REFERENCES `FIPOP`.`camera_handling` (`analysis_method_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX `fk_camera_movement_camera_handling1_idx` ON `FIPOP`.`camera_movement` (`camera_handling_analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` CHANGE `camera_distance_analysis_method_id` `camera_distance_analysis_method_id` INT(11) NULL;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` CHANGE `camera_shot_type_analysis_method_id` `camera_shot_type_analysis_method_id` INT(11) NULL;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` CHANGE `camera_vertical_angle_analysis_method_id` `camera_vertical_angle_analysis_method_id` INT(11) NULL;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` CHANGE `camera_horizontal_angle_analysis_method_id` `camera_horizontal_angle_analysis_method_id` INT(11) NULL;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` CHANGE `camera_axis_of_action_analysis_method_id` `camera_axis_of_action_analysis_method_id` INT(11) NULL;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` CHANGE `camera_elevation_analysis_method_id` `camera_elevation_analysis_method_id` INT(11) NULL;

DELETE FROM `FIPOP`.`analysis_method_type_translation` WHERE `analysis_method_type_translation`.`id` = 15;
DELETE FROM `FIPOP`.`analysis_method_type` WHERE `analysis_method_type`.`id` = 15;

SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='';

ALTER TABLE `FIPOP`.`selector_svg` CHANGE `color_rgba` `color_hex` VARCHAR(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL;
ALTER TABLE `FIPOP`.`selector_svg` ADD `opacity` TINYINT NOT NULL DEFAULT '30' AFTER `color_hex`;

SET SQL_MODE=@OLD_SQL_MODE;


ALTER TABLE `FIPOP`.`editing_rhythm_translation` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `FIPOP`.`image_cadre_editing_translation` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `FIPOP`.`montage_figure_macro_translation` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `FIPOP`.`montage_figure_micro_translation` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `FIPOP`.`playback_speed_translation` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `FIPOP`.`take_junction_translation` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `FIPOP`.`take_type_progression_translation` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT;

DROP TABLE IF EXISTS `FIPOP`.`lighting_translation`;
DROP TABLE IF EXISTS `FIPOP`.`lighting`;

-- -----------------------------------------------------
-- Table `FIPOP`.`light_modifier`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`light_modifier` (
  `analysis_method_id` INT NOT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_light_modifier_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FIPOP`.`light_modifier_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`light_modifier_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `light_modifier_analysis_method_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_light_modifier_translation_light_modifier1`
    FOREIGN KEY (`light_modifier_analysis_method_id`)
    REFERENCES `FIPOP`.`light_modifier` (`analysis_method_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_light_modifier_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_light_modifier_translation_light_modifier1_idx` ON `FIPOP`.`light_modifier_translation` (`light_modifier_analysis_method_id` ASC);

CREATE INDEX `fk_light_modifier_translation_language1_idx` ON `FIPOP`.`light_modifier_translation` (`language_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`light_position`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`light_position` (
  `analysis_method_id` INT NOT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_light_position_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FIPOP`.`light_position_angle_horizontal`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`light_position_angle_horizontal` (
  `analysis_method_id` INT NOT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_light_position_angle_horizontal_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FIPOP`.`light_position_angle_horizontal_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`light_position_angle_horizontal_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `light_position_angle_horizontal_analysis_method_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `name` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_light_position_angle_horizontal_translation_light_positio1`
    FOREIGN KEY (`light_position_angle_horizontal_analysis_method_id`)
    REFERENCES `FIPOP`.`light_position_angle_horizontal` (`analysis_method_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_light_position_angle_horizontal_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_light_position_angle_horizontal_translation_light_posit_idx` ON `FIPOP`.`light_position_angle_horizontal_translation` (`light_position_angle_horizontal_analysis_method_id` ASC);

CREATE INDEX `fk_light_position_angle_horizontal_translation_language_idx` ON `FIPOP`.`light_position_angle_horizontal_translation` (`language_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`light_position_angle_vertical`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`light_position_angle_vertical` (
  `analysis_method_id` INT NOT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_light_position_angle_vertical_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FIPOP`.`light_position_angle_vertical_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`light_position_angle_vertical_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `light_position_angle_vertical_analysis_method_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `name` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_light_position_angle_vertical_translation_light_position1`
    FOREIGN KEY (`light_position_angle_vertical_analysis_method_id`)
    REFERENCES `FIPOP`.`light_position_angle_vertical` (`analysis_method_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_light_position_angle_vertical_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_light_position_angle_vertical_translation_light_position_idx` ON `FIPOP`.`light_position_angle_vertical_translation` (`light_position_angle_vertical_analysis_method_id` ASC);

CREATE INDEX `fk_light_position_angle_vertical_translation_language1_idx` ON `FIPOP`.`light_position_angle_vertical_translation` (`language_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`light_position_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`light_position_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `light_position_analysis_method_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_light_position_translation_light_position1`
    FOREIGN KEY (`light_position_analysis_method_id`)
    REFERENCES `FIPOP`.`light_position` (`analysis_method_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_light_position_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_light_position_translation_light_position1_idx` ON `FIPOP`.`light_position_translation` (`light_position_analysis_method_id` ASC);

CREATE INDEX `fk_light_position_translation_language1_idx` ON `FIPOP`.`light_position_translation` (`language_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`lighting_duration`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`lighting_duration` (
  `analysis_method_id` INT NOT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_lighting_duration_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FIPOP`.`lighting_duration_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`lighting_duration_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `lighting_duration_analysis_method_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_lighting_duration_translation_lighting_duration1`
    FOREIGN KEY (`lighting_duration_analysis_method_id`)
    REFERENCES `FIPOP`.`lighting_duration` (`analysis_method_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_lighting_duration_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_lighting_duration_translation_lighting_duration1_idx` ON `FIPOP`.`lighting_duration_translation` (`lighting_duration_analysis_method_id` ASC);

CREATE INDEX `fk_lighting_duration_translation_language1_idx` ON `FIPOP`.`lighting_duration_translation` (`language_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`lighting_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`lighting_type` (
  `analysis_method_id` INT NOT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_lighting_type_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FIPOP`.`lighting_type_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`lighting_type_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `lighting_type_analysis_method_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_lighting_type_translation_lighting1`
    FOREIGN KEY (`lighting_type_analysis_method_id`)
    REFERENCES `FIPOP`.`lighting_type` (`analysis_method_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_lighting_type_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_lighting_type_translation_lighting1_idx` ON `FIPOP`.`lighting_type_translation` (`lighting_type_analysis_method_id` ASC);

CREATE INDEX `fk_lighting_type_translation_language1_idx` ON `FIPOP`.`lighting_type_translation` (`language_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`lighting`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`lighting` (
  `analysis_method_id` INT NOT NULL,
  `lighting_type_analysis_method_id` INT NULL,
  `light_position_analysis_method_id` INT NULL,
  `light_position_angle_horizontal_analysis_method_id` INT NULL,
  `light_position_angle_vertical_analysis_method_id` INT NULL,
  `light_modifier_analysis_method_id` INT NULL,
  `lighting_duration_analysis_method_id` INT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_lighting_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_lighting_lighting_type1`
    FOREIGN KEY (`lighting_type_analysis_method_id`)
    REFERENCES `FIPOP`.`lighting_type` (`analysis_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_lighting_light_position1`
    FOREIGN KEY (`light_position_analysis_method_id`)
    REFERENCES `FIPOP`.`light_position` (`analysis_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_lighting_light_position_angle_horizontal1`
    FOREIGN KEY (`light_position_angle_horizontal_analysis_method_id`)
    REFERENCES `FIPOP`.`light_position_angle_horizontal` (`analysis_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_lighting_light_position_angle_vertical1`
    FOREIGN KEY (`light_position_angle_vertical_analysis_method_id`)
    REFERENCES `FIPOP`.`light_position_angle_vertical` (`analysis_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_lighting_light_modifier1`
    FOREIGN KEY (`light_modifier_analysis_method_id`)
    REFERENCES `FIPOP`.`light_modifier` (`analysis_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_lighting_lighting_duration1`
    FOREIGN KEY (`lighting_duration_analysis_method_id`)
    REFERENCES `FIPOP`.`lighting_duration` (`analysis_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_lighting_lighting_type1_idx` ON `FIPOP`.`lighting` (`lighting_type_analysis_method_id` ASC);

CREATE INDEX `fk_lighting_light_position1_idx` ON `FIPOP`.`lighting` (`light_position_analysis_method_id` ASC);

CREATE INDEX `fk_lighting_light_position_angle_horizontal1_idx` ON `FIPOP`.`lighting` (`light_position_angle_horizontal_analysis_method_id` ASC);

CREATE INDEX `fk_lighting_light_position_angle_vertical1_idx` ON `FIPOP`.`lighting` (`light_position_angle_vertical_analysis_method_id` ASC);

CREATE INDEX `fk_lighting_light_modifier1_idx` ON `FIPOP`.`lighting` (`light_modifier_analysis_method_id` ASC);

CREATE INDEX `fk_lighting_lighting_duration1_idx` ON `FIPOP`.`lighting` (`lighting_duration_analysis_method_id` ASC);


-- -----------------------------------------------------
-- Data for table `FIPOP`.`analysis_method_type`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (26, 1);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (27, 1);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (28, 1);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (29, 1);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (30, 0);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (31, 1);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (32, 1);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (33, 1);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (34, 0);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (35, 1);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (36, 1);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (37, 1);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (38, 1);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (39, 1);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (40, 1);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (41, 1);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (42, 1);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (43, 0);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`analysis_method`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (82, 26);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (83, 26);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (84, 26);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (85, 26);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (86, 26);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (87, 26);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (88, 26);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (89, 26);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (90, 26);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (91, 26);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (92, 26);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (93, 26);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (94, 26);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (95, 26);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (96, 26);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (97, 26);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (98, 26);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (99, 26);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (100, 26);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (101, 27);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (102, 27);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (103, 27);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (104, 27);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (105, 27);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (106, 27);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (107, 27);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (108, 27);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (109, 27);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (110, 27);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (111, 27);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (112, 27);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (113, 27);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (114, 27);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (115, 27);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (116, 27);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (117, 27);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (118, 27);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (119, 28);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (120, 28);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (121, 28);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (122, 28);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (123, 28);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (124, 28);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (125, 28);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (126, 28);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (127, 29);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (128, 29);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (129, 29);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (130, 29);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (131, 29);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (132, 31);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (133, 31);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (134, 31);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (135, 31);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (136, 31);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (137, 32);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (138, 32);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (139, 32);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (140, 32);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (141, 32);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (142, 32);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (143, 32);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (144, 33);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (145, 33);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (146, 33);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (147, 33);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (148, 33);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (149, 33);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (150, 33);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (151, 33);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (152, 33);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (153, 35);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (154, 35);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (155, 35);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (156, 35);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (157, 35);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (158, 35);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (159, 35);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (160, 35);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (161, 35);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (162, 35);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (163, 35);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (164, 35);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (165, 35);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (166, 35);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (167, 35);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (168, 35);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (169, 35);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (170, 35);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (171, 35);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (172, 35);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (173, 35);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (174, 35);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (175, 36);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (176, 36);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (177, 36);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (178, 36);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (179, 36);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (180, 36);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (181, 36);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (182, 37);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (183, 37);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (184, 37);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (185, 37);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (186, 37);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (187, 37);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (188, 38);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (189, 38);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (190, 38);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (191, 38);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (192, 38);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (193, 38);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (194, 38);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (195, 39);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (196, 39);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (197, 39);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (198, 39);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (199, 39);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (200, 39);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (201, 39);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (202, 39);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (203, 39);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (204, 39);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (205, 39);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (206, 39);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (207, 40);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (208, 40);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (209, 40);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (210, 40);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (211, 40);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (212, 40);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (213, 40);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (214, 40);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (215, 40);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (216, 40);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (217, 40);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (218, 40);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (219, 41);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (220, 41);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (221, 41);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (222, 41);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (223, 41);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (224, 41);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (225, 41);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (226, 41);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (227, 42);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (228, 42);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (229, 42);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (230, 42);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (231, 42);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`analysis_method_type_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (26, 1, 26, 'MontageFigureMacro');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (27, 1, 27, 'MontageFigureMicro');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (28, 1, 28, 'TakeJunction');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (29, 1, 29, 'EditingRhythm');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (30, 1, 30, 'TakeLength');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (31, 1, 31, 'TakeTypeProgression');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (32, 1, 32, 'PlaybackSpeed');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (33, 1, 33, 'ImageCadreEditing');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (34, 1, 34, 'EditingMontage');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (35, 1, 35, 'ConceptDirection');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (36, 1, 36, 'CameraMovementCharacteristic');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (37, 1, 37, 'CameraMovementType');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (38, 1, 38, 'LightPositionGeneral');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (39, 1, 39, 'LightPositionAngleHorizontal');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (40, 1, 40, 'LightPositionAngleVertical');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (41, 1, 41, 'LightModifier');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (42, 1, 42, 'LightingDuration');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (43, 1, 43, 'Lighting');

COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`editing_rhythm`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`editing_rhythm` (`analysis_method_id`) VALUES (127);
INSERT INTO `FIPOP`.`editing_rhythm` (`analysis_method_id`) VALUES (128);
INSERT INTO `FIPOP`.`editing_rhythm` (`analysis_method_id`) VALUES (129);
INSERT INTO `FIPOP`.`editing_rhythm` (`analysis_method_id`) VALUES (130);
INSERT INTO `FIPOP`.`editing_rhythm` (`analysis_method_id`) VALUES (131);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`editing_rhythm_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`editing_rhythm_translation` (`id`, `editing_rhythm_analysis_method_id`, `language_id`, `name`) VALUES (1, 127, 1, 'Accelerating (rapid cuts)');
INSERT INTO `FIPOP`.`editing_rhythm_translation` (`id`, `editing_rhythm_analysis_method_id`, `language_id`, `name`) VALUES (2, 128, 1, 'Decellerating (long takes)');
INSERT INTO `FIPOP`.`editing_rhythm_translation` (`id`, `editing_rhythm_analysis_method_id`, `language_id`, `name`) VALUES (3, 129, 1, 'Metric (takes of equal length or length patterns)');
INSERT INTO `FIPOP`.`editing_rhythm_translation` (`id`, `editing_rhythm_analysis_method_id`, `language_id`, `name`) VALUES (4, 130, 1, 'Changing');
INSERT INTO `FIPOP`.`editing_rhythm_translation` (`id`, `editing_rhythm_analysis_method_id`, `language_id`, `name`) VALUES (5, 131, 1, 'Other');

COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`image_cadre_editing`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`image_cadre_editing` (`analysis_method_id`) VALUES (144);
INSERT INTO `FIPOP`.`image_cadre_editing` (`analysis_method_id`) VALUES (145);
INSERT INTO `FIPOP`.`image_cadre_editing` (`analysis_method_id`) VALUES (146);
INSERT INTO `FIPOP`.`image_cadre_editing` (`analysis_method_id`) VALUES (147);
INSERT INTO `FIPOP`.`image_cadre_editing` (`analysis_method_id`) VALUES (148);
INSERT INTO `FIPOP`.`image_cadre_editing` (`analysis_method_id`) VALUES (149);
INSERT INTO `FIPOP`.`image_cadre_editing` (`analysis_method_id`) VALUES (150);
INSERT INTO `FIPOP`.`image_cadre_editing` (`analysis_method_id`) VALUES (151);
INSERT INTO `FIPOP`.`image_cadre_editing` (`analysis_method_id`) VALUES (152);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`image_cadre_editing_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`image_cadre_editing_translation` (`id`, `image_cadre_editing_analysis_method_id`, `language_id`, `name`) VALUES (1, 144, 1, 'Regular (take fills screen)');
INSERT INTO `FIPOP`.`image_cadre_editing_translation` (`id`, `image_cadre_editing_analysis_method_id`, `language_id`, `name`) VALUES (2, 145, 1, 'Letterbox (widescreen aspect ratio)');
INSERT INTO `FIPOP`.`image_cadre_editing_translation` (`id`, `image_cadre_editing_analysis_method_id`, `language_id`, `name`) VALUES (3, 146, 1, 'Pillarbox (e.g. cell phone video)');
INSERT INTO `FIPOP`.`image_cadre_editing_translation` (`id`, `image_cadre_editing_analysis_method_id`, `language_id`, `name`) VALUES (4, 147, 1, 'Windowbox (rectangle video does not fill screen)');
INSERT INTO `FIPOP`.`image_cadre_editing_translation` (`id`, `image_cadre_editing_analysis_method_id`, `language_id`, `name`) VALUES (5, 148, 1, 'Split Screen');
INSERT INTO `FIPOP`.`image_cadre_editing_translation` (`id`, `image_cadre_editing_analysis_method_id`, `language_id`, `name`) VALUES (6, 149, 1, 'Frame in Frame');
INSERT INTO `FIPOP`.`image_cadre_editing_translation` (`id`, `image_cadre_editing_analysis_method_id`, `language_id`, `name`) VALUES (7, 150, 1, 'Tiles');
INSERT INTO `FIPOP`.`image_cadre_editing_translation` (`id`, `image_cadre_editing_analysis_method_id`, `language_id`, `name`) VALUES (8, 151, 1, 'Zoomed In (image exceeds screen)');
INSERT INTO `FIPOP`.`image_cadre_editing_translation` (`id`, `image_cadre_editing_analysis_method_id`, `language_id`, `name`) VALUES (9, 152, 1, 'Other');

COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`montage_figure_macro`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`montage_figure_macro` (`analysis_method_id`) VALUES (82);
INSERT INTO `FIPOP`.`montage_figure_macro` (`analysis_method_id`) VALUES (83);
INSERT INTO `FIPOP`.`montage_figure_macro` (`analysis_method_id`) VALUES (84);
INSERT INTO `FIPOP`.`montage_figure_macro` (`analysis_method_id`) VALUES (85);
INSERT INTO `FIPOP`.`montage_figure_macro` (`analysis_method_id`) VALUES (86);
INSERT INTO `FIPOP`.`montage_figure_macro` (`analysis_method_id`) VALUES (87);
INSERT INTO `FIPOP`.`montage_figure_macro` (`analysis_method_id`) VALUES (88);
INSERT INTO `FIPOP`.`montage_figure_macro` (`analysis_method_id`) VALUES (89);
INSERT INTO `FIPOP`.`montage_figure_macro` (`analysis_method_id`) VALUES (90);
INSERT INTO `FIPOP`.`montage_figure_macro` (`analysis_method_id`) VALUES (91);
INSERT INTO `FIPOP`.`montage_figure_macro` (`analysis_method_id`) VALUES (92);
INSERT INTO `FIPOP`.`montage_figure_macro` (`analysis_method_id`) VALUES (93);
INSERT INTO `FIPOP`.`montage_figure_macro` (`analysis_method_id`) VALUES (94);
INSERT INTO `FIPOP`.`montage_figure_macro` (`analysis_method_id`) VALUES (95);
INSERT INTO `FIPOP`.`montage_figure_macro` (`analysis_method_id`) VALUES (96);
INSERT INTO `FIPOP`.`montage_figure_macro` (`analysis_method_id`) VALUES (97);
INSERT INTO `FIPOP`.`montage_figure_macro` (`analysis_method_id`) VALUES (98);
INSERT INTO `FIPOP`.`montage_figure_macro` (`analysis_method_id`) VALUES (99);
INSERT INTO `FIPOP`.`montage_figure_macro` (`analysis_method_id`) VALUES (100);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`montage_figure_macro_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`montage_figure_macro_translation` (`id`, `montage_figure_macro_analysis_method_id`, `language_id`, `name`) VALUES (1, 82, 1, 'Continuity Editing');
INSERT INTO `FIPOP`.`montage_figure_macro_translation` (`id`, `montage_figure_macro_analysis_method_id`, `language_id`, `name`) VALUES (2, 83, 1, 'Confrontational Editing');
INSERT INTO `FIPOP`.`montage_figure_macro_translation` (`id`, `montage_figure_macro_analysis_method_id`, `language_id`, `name`) VALUES (3, 84, 1, 'Metric Montage');
INSERT INTO `FIPOP`.`montage_figure_macro_translation` (`id`, `montage_figure_macro_analysis_method_id`, `language_id`, `name`) VALUES (4, 85, 1, 'Rhytmic Montage');
INSERT INTO `FIPOP`.`montage_figure_macro_translation` (`id`, `montage_figure_macro_analysis_method_id`, `language_id`, `name`) VALUES (5, 86, 1, 'Tonal Montage');
INSERT INTO `FIPOP`.`montage_figure_macro_translation` (`id`, `montage_figure_macro_analysis_method_id`, `language_id`, `name`) VALUES (6, 87, 1, 'Overtonal Montage');
INSERT INTO `FIPOP`.`montage_figure_macro_translation` (`id`, `montage_figure_macro_analysis_method_id`, `language_id`, `name`) VALUES (7, 88, 1, 'Intellectual Montage');
INSERT INTO `FIPOP`.`montage_figure_macro_translation` (`id`, `montage_figure_macro_analysis_method_id`, `language_id`, `name`) VALUES (8, 89, 1, 'Bracket');
INSERT INTO `FIPOP`.`montage_figure_macro_translation` (`id`, `montage_figure_macro_analysis_method_id`, `language_id`, `name`) VALUES (9, 90, 1, 'Parallel Montage');
INSERT INTO `FIPOP`.`montage_figure_macro_translation` (`id`, `montage_figure_macro_analysis_method_id`, `language_id`, `name`) VALUES (10, 91, 1, 'Montage Sequence');
INSERT INTO `FIPOP`.`montage_figure_macro_translation` (`id`, `montage_figure_macro_analysis_method_id`, `language_id`, `name`) VALUES (11, 92, 1, 'Associational Montage');
INSERT INTO `FIPOP`.`montage_figure_macro_translation` (`id`, `montage_figure_macro_analysis_method_id`, `language_id`, `name`) VALUES (12, 93, 1, 'Shot - Countershot');
INSERT INTO `FIPOP`.`montage_figure_macro_translation` (`id`, `montage_figure_macro_analysis_method_id`, `language_id`, `name`) VALUES (13, 94, 1, 'Shot - Reverse Shot');
INSERT INTO `FIPOP`.`montage_figure_macro_translation` (`id`, `montage_figure_macro_analysis_method_id`, `language_id`, `name`) VALUES (14, 95, 1, 'Sequence Shot');
INSERT INTO `FIPOP`.`montage_figure_macro_translation` (`id`, `montage_figure_macro_analysis_method_id`, `language_id`, `name`) VALUES (15, 96, 1, 'Abstract Form');
INSERT INTO `FIPOP`.`montage_figure_macro_translation` (`id`, `montage_figure_macro_analysis_method_id`, `language_id`, `name`) VALUES (16, 97, 1, 'Cross-Cutting');
INSERT INTO `FIPOP`.`montage_figure_macro_translation` (`id`, `montage_figure_macro_analysis_method_id`, `language_id`, `name`) VALUES (17, 98, 1, '180° Rule');
INSERT INTO `FIPOP`.`montage_figure_macro_translation` (`id`, `montage_figure_macro_analysis_method_id`, `language_id`, `name`) VALUES (18, 99, 1, 'Summary / Summary Cut');
INSERT INTO `FIPOP`.`montage_figure_macro_translation` (`id`, `montage_figure_macro_analysis_method_id`, `language_id`, `name`) VALUES (19, 100, 1, 'Other');

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`montage_figure_micro`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`montage_figure_micro` (`analysis_method_id`) VALUES (101);
INSERT INTO `FIPOP`.`montage_figure_micro` (`analysis_method_id`) VALUES (102);
INSERT INTO `FIPOP`.`montage_figure_micro` (`analysis_method_id`) VALUES (103);
INSERT INTO `FIPOP`.`montage_figure_micro` (`analysis_method_id`) VALUES (104);
INSERT INTO `FIPOP`.`montage_figure_micro` (`analysis_method_id`) VALUES (105);
INSERT INTO `FIPOP`.`montage_figure_micro` (`analysis_method_id`) VALUES (106);
INSERT INTO `FIPOP`.`montage_figure_micro` (`analysis_method_id`) VALUES (107);
INSERT INTO `FIPOP`.`montage_figure_micro` (`analysis_method_id`) VALUES (108);
INSERT INTO `FIPOP`.`montage_figure_micro` (`analysis_method_id`) VALUES (109);
INSERT INTO `FIPOP`.`montage_figure_micro` (`analysis_method_id`) VALUES (110);
INSERT INTO `FIPOP`.`montage_figure_micro` (`analysis_method_id`) VALUES (111);
INSERT INTO `FIPOP`.`montage_figure_micro` (`analysis_method_id`) VALUES (112);
INSERT INTO `FIPOP`.`montage_figure_micro` (`analysis_method_id`) VALUES (113);
INSERT INTO `FIPOP`.`montage_figure_micro` (`analysis_method_id`) VALUES (114);
INSERT INTO `FIPOP`.`montage_figure_micro` (`analysis_method_id`) VALUES (115);
INSERT INTO `FIPOP`.`montage_figure_micro` (`analysis_method_id`) VALUES (116);
INSERT INTO `FIPOP`.`montage_figure_micro` (`analysis_method_id`) VALUES (117);
INSERT INTO `FIPOP`.`montage_figure_micro` (`analysis_method_id`) VALUES (118);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`montage_figure_micro_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`montage_figure_micro_translation` (`id`, `montage_figure_micro_analysis_method_id`, `language_id`, `name`) VALUES (1, 101, 1, 'Cut-In');
INSERT INTO `FIPOP`.`montage_figure_micro_translation` (`id`, `montage_figure_micro_analysis_method_id`, `language_id`, `name`) VALUES (2, 102, 1, 'Cut-Out');
INSERT INTO `FIPOP`.`montage_figure_micro_translation` (`id`, `montage_figure_micro_analysis_method_id`, `language_id`, `name`) VALUES (3, 103, 1, 'Cut-Away');
INSERT INTO `FIPOP`.`montage_figure_micro_translation` (`id`, `montage_figure_micro_analysis_method_id`, `language_id`, `name`) VALUES (4, 104, 1, 'Insert');
INSERT INTO `FIPOP`.`montage_figure_micro_translation` (`id`, `montage_figure_micro_analysis_method_id`, `language_id`, `name`) VALUES (5, 105, 1, 'Jump Cut');
INSERT INTO `FIPOP`.`montage_figure_micro_translation` (`id`, `montage_figure_micro_analysis_method_id`, `language_id`, `name`) VALUES (6, 106, 1, 'Match Cut');
INSERT INTO `FIPOP`.`montage_figure_micro_translation` (`id`, `montage_figure_micro_analysis_method_id`, `language_id`, `name`) VALUES (7, 107, 1, 'Match on Action');
INSERT INTO `FIPOP`.`montage_figure_micro_translation` (`id`, `montage_figure_micro_analysis_method_id`, `language_id`, `name`) VALUES (8, 108, 1, 'Match on Form / Graphic Match');
INSERT INTO `FIPOP`.`montage_figure_micro_translation` (`id`, `montage_figure_micro_analysis_method_id`, `language_id`, `name`) VALUES (9, 109, 1, 'Match on Movement / Movement Continuity');
INSERT INTO `FIPOP`.`montage_figure_micro_translation` (`id`, `montage_figure_micro_analysis_method_id`, `language_id`, `name`) VALUES (10, 110, 1, 'Point of View (closed)');
INSERT INTO `FIPOP`.`montage_figure_micro_translation` (`id`, `montage_figure_micro_analysis_method_id`, `language_id`, `name`) VALUES (11, 111, 1, 'Point of View (open)');
INSERT INTO `FIPOP`.`montage_figure_micro_translation` (`id`, `montage_figure_micro_analysis_method_id`, `language_id`, `name`) VALUES (12, 112, 1, 'Eyeline Match');
INSERT INTO `FIPOP`.`montage_figure_micro_translation` (`id`, `montage_figure_micro_analysis_method_id`, `language_id`, `name`) VALUES (13, 113, 1, 'Cut Cheating');
INSERT INTO `FIPOP`.`montage_figure_micro_translation` (`id`, `montage_figure_micro_analysis_method_id`, `language_id`, `name`) VALUES (14, 114, 1, 'Cross-Cutting');
INSERT INTO `FIPOP`.`montage_figure_micro_translation` (`id`, `montage_figure_micro_analysis_method_id`, `language_id`, `name`) VALUES (15, 115, 1, 'Classic Syntax (Establishing Shot - Close Shots - De-Establishing Shot)');
INSERT INTO `FIPOP`.`montage_figure_micro_translation` (`id`, `montage_figure_micro_analysis_method_id`, `language_id`, `name`) VALUES (16, 116, 1, '180° Rule');
INSERT INTO `FIPOP`.`montage_figure_micro_translation` (`id`, `montage_figure_micro_analysis_method_id`, `language_id`, `name`) VALUES (17, 117, 1, 'Summary / Summary Cut');
INSERT INTO `FIPOP`.`montage_figure_micro_translation` (`id`, `montage_figure_micro_analysis_method_id`, `language_id`, `name`) VALUES (18, 118, 1, 'Other');

COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`playback_speed`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`playback_speed` (`analysis_method_id`) VALUES (137);
INSERT INTO `FIPOP`.`playback_speed` (`analysis_method_id`) VALUES (138);
INSERT INTO `FIPOP`.`playback_speed` (`analysis_method_id`) VALUES (139);
INSERT INTO `FIPOP`.`playback_speed` (`analysis_method_id`) VALUES (140);
INSERT INTO `FIPOP`.`playback_speed` (`analysis_method_id`) VALUES (141);
INSERT INTO `FIPOP`.`playback_speed` (`analysis_method_id`) VALUES (142);
INSERT INTO `FIPOP`.`playback_speed` (`analysis_method_id`) VALUES (143);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`playback_speed_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`playback_speed_translation` (`id`, `playback_speed_analysis_method_id`, `language_id`, `name`) VALUES (1, 137, 1, 'Regular');
INSERT INTO `FIPOP`.`playback_speed_translation` (`id`, `playback_speed_analysis_method_id`, `language_id`, `name`) VALUES (2, 138, 1, 'Slow Motion');
INSERT INTO `FIPOP`.`playback_speed_translation` (`id`, `playback_speed_analysis_method_id`, `language_id`, `name`) VALUES (3, 139, 1, 'Freeze Frame');
INSERT INTO `FIPOP`.`playback_speed_translation` (`id`, `playback_speed_analysis_method_id`, `language_id`, `name`) VALUES (4, 140, 1, 'Sped Up');
INSERT INTO `FIPOP`.`playback_speed_translation` (`id`, `playback_speed_analysis_method_id`, `language_id`, `name`) VALUES (5, 141, 1, 'Reverse Speed, Regular');
INSERT INTO `FIPOP`.`playback_speed_translation` (`id`, `playback_speed_analysis_method_id`, `language_id`, `name`) VALUES (6, 142, 1, 'Reverse Speed, Rapid');
INSERT INTO `FIPOP`.`playback_speed_translation` (`id`, `playback_speed_analysis_method_id`, `language_id`, `name`) VALUES (7, 143, 1, 'Reverse Speed, Slow');

COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`take_junction`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`take_junction` (`analysis_method_id`) VALUES (119);
INSERT INTO `FIPOP`.`take_junction` (`analysis_method_id`) VALUES (120);
INSERT INTO `FIPOP`.`take_junction` (`analysis_method_id`) VALUES (121);
INSERT INTO `FIPOP`.`take_junction` (`analysis_method_id`) VALUES (122);
INSERT INTO `FIPOP`.`take_junction` (`analysis_method_id`) VALUES (123);
INSERT INTO `FIPOP`.`take_junction` (`analysis_method_id`) VALUES (124);
INSERT INTO `FIPOP`.`take_junction` (`analysis_method_id`) VALUES (125);
INSERT INTO `FIPOP`.`take_junction` (`analysis_method_id`) VALUES (126);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`take_junction_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`take_junction_translation` (`id`, `take_junction_analysis_method_id`, `language_id`, `name`) VALUES (1, 119, 1, 'Cut');
INSERT INTO `FIPOP`.`take_junction_translation` (`id`, `take_junction_analysis_method_id`, `language_id`, `name`) VALUES (2, 120, 1, 'Dissolve');
INSERT INTO `FIPOP`.`take_junction_translation` (`id`, `take_junction_analysis_method_id`, `language_id`, `name`) VALUES (3, 121, 1, 'Fade-In');
INSERT INTO `FIPOP`.`take_junction_translation` (`id`, `take_junction_analysis_method_id`, `language_id`, `name`) VALUES (4, 122, 1, 'Fade-Out');
INSERT INTO `FIPOP`.`take_junction_translation` (`id`, `take_junction_analysis_method_id`, `language_id`, `name`) VALUES (5, 123, 1, 'Wipe');
INSERT INTO `FIPOP`.`take_junction_translation` (`id`, `take_junction_analysis_method_id`, `language_id`, `name`) VALUES (6, 124, 1, 'Iris');
INSERT INTO `FIPOP`.`take_junction_translation` (`id`, `take_junction_analysis_method_id`, `language_id`, `name`) VALUES (7, 125, 1, 'Special Shape');
INSERT INTO `FIPOP`.`take_junction_translation` (`id`, `take_junction_analysis_method_id`, `language_id`, `name`) VALUES (8, 126, 1, 'Other');

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`take_type_progression`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`take_type_progression` (`analysis_method_id`) VALUES (132);
INSERT INTO `FIPOP`.`take_type_progression` (`analysis_method_id`) VALUES (133);
INSERT INTO `FIPOP`.`take_type_progression` (`analysis_method_id`) VALUES (134);
INSERT INTO `FIPOP`.`take_type_progression` (`analysis_method_id`) VALUES (135);
INSERT INTO `FIPOP`.`take_type_progression` (`analysis_method_id`) VALUES (136);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`take_type_progression_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`take_type_progression_translation` (`id`, `take_type_progression_analysis_method_id`, `language_id`, `name`) VALUES (1, 132, 1, 'Progressive (wide shot to close-up)');
INSERT INTO `FIPOP`.`take_type_progression_translation` (`id`, `take_type_progression_analysis_method_id`, `language_id`, `name`) VALUES (2, 133, 1, 'Degressive (close-up to wide shot)');
INSERT INTO `FIPOP`.`take_type_progression_translation` (`id`, `take_type_progression_analysis_method_id`, `language_id`, `name`) VALUES (3, 134, 1, 'Stable / Unchanging');
INSERT INTO `FIPOP`.`take_type_progression_translation` (`id`, `take_type_progression_analysis_method_id`, `language_id`, `name`) VALUES (4, 135, 1, 'Non-Fluent Progression');
INSERT INTO `FIPOP`.`take_type_progression_translation` (`id`, `take_type_progression_analysis_method_id`, `language_id`, `name`) VALUES (5, 136, 1, 'Other');

COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`camera_movement_characteristic`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`camera_movement_characteristic` (`analysis_method_id`) VALUES (175);
INSERT INTO `FIPOP`.`camera_movement_characteristic` (`analysis_method_id`) VALUES (176);
INSERT INTO `FIPOP`.`camera_movement_characteristic` (`analysis_method_id`) VALUES (177);
INSERT INTO `FIPOP`.`camera_movement_characteristic` (`analysis_method_id`) VALUES (178);
INSERT INTO `FIPOP`.`camera_movement_characteristic` (`analysis_method_id`) VALUES (179);
INSERT INTO `FIPOP`.`camera_movement_characteristic` (`analysis_method_id`) VALUES (180);
INSERT INTO `FIPOP`.`camera_movement_characteristic` (`analysis_method_id`) VALUES (181);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`camera_movement_characteristic_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`camera_movement_characteristic_translation` (`id`, `camera_movement_characteristic_analysis_method_id`, `language_id`, `type`) VALUES (1, 175, 1, 'Extrem langsam');
INSERT INTO `FIPOP`.`camera_movement_characteristic_translation` (`id`, `camera_movement_characteristic_analysis_method_id`, `language_id`, `type`) VALUES (2, 176, 1, 'Sehr langsam');
INSERT INTO `FIPOP`.`camera_movement_characteristic_translation` (`id`, `camera_movement_characteristic_analysis_method_id`, `language_id`, `type`) VALUES (3, 177, 1, 'Langsam');
INSERT INTO `FIPOP`.`camera_movement_characteristic_translation` (`id`, `camera_movement_characteristic_analysis_method_id`, `language_id`, `type`) VALUES (4, 178, 1, 'Mittel');
INSERT INTO `FIPOP`.`camera_movement_characteristic_translation` (`id`, `camera_movement_characteristic_analysis_method_id`, `language_id`, `type`) VALUES (5, 179, 1, 'Schnell');
INSERT INTO `FIPOP`.`camera_movement_characteristic_translation` (`id`, `camera_movement_characteristic_analysis_method_id`, `language_id`, `type`) VALUES (6, 180, 1, 'Sehr schnell');
INSERT INTO `FIPOP`.`camera_movement_characteristic_translation` (`id`, `camera_movement_characteristic_analysis_method_id`, `language_id`, `type`) VALUES (7, 181, 1, 'Extrem schnell');

COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`concept_direction`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`concept_direction` (`analysis_method_id`) VALUES (153);
INSERT INTO `FIPOP`.`concept_direction` (`analysis_method_id`) VALUES (154);
INSERT INTO `FIPOP`.`concept_direction` (`analysis_method_id`) VALUES (155);
INSERT INTO `FIPOP`.`concept_direction` (`analysis_method_id`) VALUES (156);
INSERT INTO `FIPOP`.`concept_direction` (`analysis_method_id`) VALUES (157);
INSERT INTO `FIPOP`.`concept_direction` (`analysis_method_id`) VALUES (158);
INSERT INTO `FIPOP`.`concept_direction` (`analysis_method_id`) VALUES (159);
INSERT INTO `FIPOP`.`concept_direction` (`analysis_method_id`) VALUES (160);
INSERT INTO `FIPOP`.`concept_direction` (`analysis_method_id`) VALUES (161);
INSERT INTO `FIPOP`.`concept_direction` (`analysis_method_id`) VALUES (162);
INSERT INTO `FIPOP`.`concept_direction` (`analysis_method_id`) VALUES (163);
INSERT INTO `FIPOP`.`concept_direction` (`analysis_method_id`) VALUES (164);
INSERT INTO `FIPOP`.`concept_direction` (`analysis_method_id`) VALUES (165);
INSERT INTO `FIPOP`.`concept_direction` (`analysis_method_id`) VALUES (166);
INSERT INTO `FIPOP`.`concept_direction` (`analysis_method_id`) VALUES (167);
INSERT INTO `FIPOP`.`concept_direction` (`analysis_method_id`) VALUES (168);
INSERT INTO `FIPOP`.`concept_direction` (`analysis_method_id`) VALUES (169);
INSERT INTO `FIPOP`.`concept_direction` (`analysis_method_id`) VALUES (170);
INSERT INTO `FIPOP`.`concept_direction` (`analysis_method_id`) VALUES (171);
INSERT INTO `FIPOP`.`concept_direction` (`analysis_method_id`) VALUES (172);
INSERT INTO `FIPOP`.`concept_direction` (`analysis_method_id`) VALUES (173);
INSERT INTO `FIPOP`.`concept_direction` (`analysis_method_id`) VALUES (174);

COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`concept_direction_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`concept_direction_translation` (`id`, `concept_direction_analysis_method_id`, `language_id`, `type`) VALUES (1, 153, 1, 'zusammenlaufend, konvergierend (räumlich)');
INSERT INTO `FIPOP`.`concept_direction_translation` (`id`, `concept_direction_analysis_method_id`, `language_id`, `type`) VALUES (2, 154, 1, 'auseinanderlaufend, divergierend (räumlich)');
INSERT INTO `FIPOP`.`concept_direction_translation` (`id`, `concept_direction_analysis_method_id`, `language_id`, `type`) VALUES (3, 155, 1, 'parallel (räumlich)');
INSERT INTO `FIPOP`.`concept_direction_translation` (`id`, `concept_direction_analysis_method_id`, `language_id`, `type`) VALUES (4, 156, 1, 'vorwärts');
INSERT INTO `FIPOP`.`concept_direction_translation` (`id`, `concept_direction_analysis_method_id`, `language_id`, `type`) VALUES (5, 157, 1, 'rückwärts');
INSERT INTO `FIPOP`.`concept_direction_translation` (`id`, `concept_direction_analysis_method_id`, `language_id`, `type`) VALUES (6, 158, 1, 'hin zu, nach');
INSERT INTO `FIPOP`.`concept_direction_translation` (`id`, `concept_direction_analysis_method_id`, `language_id`, `type`) VALUES (7, 159, 1, 'weg von');
INSERT INTO `FIPOP`.`concept_direction_translation` (`id`, `concept_direction_analysis_method_id`, `language_id`, `type`) VALUES (8, 160, 1, 'heran (auf mich zu)');
INSERT INTO `FIPOP`.`concept_direction_translation` (`id`, `concept_direction_analysis_method_id`, `language_id`, `type`) VALUES (9, 161, 1, 'hinweg (von mir weg)');
INSERT INTO `FIPOP`.`concept_direction_translation` (`id`, `concept_direction_analysis_method_id`, `language_id`, `type`) VALUES (10, 162, 1, 'hinauf (nach oben zu mir)');
INSERT INTO `FIPOP`.`concept_direction_translation` (`id`, `concept_direction_analysis_method_id`, `language_id`, `type`) VALUES (11, 163, 1, 'hinab (nach unten zu mir)');
INSERT INTO `FIPOP`.`concept_direction_translation` (`id`, `concept_direction_analysis_method_id`, `language_id`, `type`) VALUES (12, 164, 1, 'zusammen (Bewegung)');
INSERT INTO `FIPOP`.`concept_direction_translation` (`id`, `concept_direction_analysis_method_id`, `language_id`, `type`) VALUES (13, 165, 1, 'auseinander (Bewegung)');
INSERT INTO `FIPOP`.`concept_direction_translation` (`id`, `concept_direction_analysis_method_id`, `language_id`, `type`) VALUES (14, 166, 1, 'nach außen');
INSERT INTO `FIPOP`.`concept_direction_translation` (`id`, `concept_direction_analysis_method_id`, `language_id`, `type`) VALUES (15, 167, 1, 'nach innen');
INSERT INTO `FIPOP`.`concept_direction_translation` (`id`, `concept_direction_analysis_method_id`, `language_id`, `type`) VALUES (16, 168, 1, 'nach vorne');
INSERT INTO `FIPOP`.`concept_direction_translation` (`id`, `concept_direction_analysis_method_id`, `language_id`, `type`) VALUES (17, 169, 1, 'nach hinten');
INSERT INTO `FIPOP`.`concept_direction_translation` (`id`, `concept_direction_analysis_method_id`, `language_id`, `type`) VALUES (18, 170, 1, 'nach rechts');
INSERT INTO `FIPOP`.`concept_direction_translation` (`id`, `concept_direction_analysis_method_id`, `language_id`, `type`) VALUES (19, 171, 1, 'nacht links');
INSERT INTO `FIPOP`.`concept_direction_translation` (`id`, `concept_direction_analysis_method_id`, `language_id`, `type`) VALUES (20, 172, 1, 'nach oben; aufwärts');
INSERT INTO `FIPOP`.`concept_direction_translation` (`id`, `concept_direction_analysis_method_id`, `language_id`, `type`) VALUES (21, 173, 1, 'nach unten; abwärts');
INSERT INTO `FIPOP`.`concept_direction_translation` (`id`, `concept_direction_analysis_method_id`, `language_id`, `type`) VALUES (22, 174, 1, 'sich verteilen');

COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`camera_movement_type`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`camera_movement_type` (`analysis_method_id`) VALUES (182);
INSERT INTO `FIPOP`.`camera_movement_type` (`analysis_method_id`) VALUES (183);
INSERT INTO `FIPOP`.`camera_movement_type` (`analysis_method_id`) VALUES (184);
INSERT INTO `FIPOP`.`camera_movement_type` (`analysis_method_id`) VALUES (185);
INSERT INTO `FIPOP`.`camera_movement_type` (`analysis_method_id`) VALUES (186);
INSERT INTO `FIPOP`.`camera_movement_type` (`analysis_method_id`) VALUES (187);

COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`camera_movement_type_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`camera_movement_type_translation` (`id`, `camera_movement_type_analysis_method_id`, `language_id`, `type`) VALUES (1, 182, 1, 'Movement (Camera)');
INSERT INTO `FIPOP`.`camera_movement_type_translation` (`id`, `camera_movement_type_analysis_method_id`, `language_id`, `type`) VALUES (2, 183, 1, 'Movement (Object)');
INSERT INTO `FIPOP`.`camera_movement_type_translation` (`id`, `camera_movement_type_analysis_method_id`, `language_id`, `type`) VALUES (3, 184, 1, 'Zoom in');
INSERT INTO `FIPOP`.`camera_movement_type_translation` (`id`, `camera_movement_type_analysis_method_id`, `language_id`, `type`) VALUES (4, 185, 1, 'Panning/Tilting');
INSERT INTO `FIPOP`.`camera_movement_type_translation` (`id`, `camera_movement_type_analysis_method_id`, `language_id`, `type`) VALUES (5, 186, 1, 'Roll');
INSERT INTO `FIPOP`.`camera_movement_type_translation` (`id`, `camera_movement_type_analysis_method_id`, `language_id`, `type`) VALUES (6, 187, 1, 'Tumbling');
INSERT INTO `FIPOP`.`camera_movement_type_translation` (`id`, `camera_movement_type_analysis_method_id`, `language_id`, `type`) VALUES (7, 182, 2, 'Movement (Camera)');
INSERT INTO `FIPOP`.`camera_movement_type_translation` (`id`, `camera_movement_type_analysis_method_id`, `language_id`, `type`) VALUES (8, 183, 2, 'Movement (Object)');
INSERT INTO `FIPOP`.`camera_movement_type_translation` (`id`, `camera_movement_type_analysis_method_id`, `language_id`, `type`) VALUES (9, 184, 2, 'Zoom in');
INSERT INTO `FIPOP`.`camera_movement_type_translation` (`id`, `camera_movement_type_analysis_method_id`, `language_id`, `type`) VALUES (10, 185, 2, 'Panning (left-right)/Tilting (up-down)');
INSERT INTO `FIPOP`.`camera_movement_type_translation` (`id`, `camera_movement_type_analysis_method_id`, `language_id`, `type`) VALUES (11, 186, 2, 'Roll');
INSERT INTO `FIPOP`.`camera_movement_type_translation` (`id`, `camera_movement_type_analysis_method_id`, `language_id`, `type`) VALUES (12, 187, 2, 'Tumbling');
INSERT INTO `FIPOP`.`camera_movement_type_translation` (`id`, `camera_movement_type_analysis_method_id`, `language_id`, `type`) VALUES (13, 182, 3, 'Bewegung (Kamera)');
INSERT INTO `FIPOP`.`camera_movement_type_translation` (`id`, `camera_movement_type_analysis_method_id`, `language_id`, `type`) VALUES (14, 183, 3, 'Bewegung (Darstellungsobjekt)');
INSERT INTO `FIPOP`.`camera_movement_type_translation` (`id`, `camera_movement_type_analysis_method_id`, `language_id`, `type`) VALUES (15, 184, 3, 'Zoom');
INSERT INTO `FIPOP`.`camera_movement_type_translation` (`id`, `camera_movement_type_analysis_method_id`, `language_id`, `type`) VALUES (16, 185, 3, 'Schwenk');
INSERT INTO `FIPOP`.`camera_movement_type_translation` (`id`, `camera_movement_type_analysis_method_id`, `language_id`, `type`) VALUES (17, 186, 3, 'Rollen');
INSERT INTO `FIPOP`.`camera_movement_type_translation` (`id`, `camera_movement_type_analysis_method_id`, `language_id`, `type`) VALUES (18, 187, 3, 'Taumeln');

COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`light_modifier`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`light_modifier` (`analysis_method_id`) VALUES (219);
INSERT INTO `FIPOP`.`light_modifier` (`analysis_method_id`) VALUES (220);
INSERT INTO `FIPOP`.`light_modifier` (`analysis_method_id`) VALUES (221);
INSERT INTO `FIPOP`.`light_modifier` (`analysis_method_id`) VALUES (222);
INSERT INTO `FIPOP`.`light_modifier` (`analysis_method_id`) VALUES (223);
INSERT INTO `FIPOP`.`light_modifier` (`analysis_method_id`) VALUES (224);
INSERT INTO `FIPOP`.`light_modifier` (`analysis_method_id`) VALUES (225);
INSERT INTO `FIPOP`.`light_modifier` (`analysis_method_id`) VALUES (226);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`light_modifier_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`light_modifier_translation` (`id`, `light_modifier_analysis_method_id`, `language_id`, `name`) VALUES (1, 219, 1, 'Reflector');
INSERT INTO `FIPOP`.`light_modifier_translation` (`id`, `light_modifier_analysis_method_id`, `language_id`, `name`) VALUES (2, 220, 1, 'Softbox');
INSERT INTO `FIPOP`.`light_modifier_translation` (`id`, `light_modifier_analysis_method_id`, `language_id`, `name`) VALUES (3, 221, 1, 'Light Shield');
INSERT INTO `FIPOP`.`light_modifier_translation` (`id`, `light_modifier_analysis_method_id`, `language_id`, `name`) VALUES (4, 222, 1, 'Honeycomb Filter');
INSERT INTO `FIPOP`.`light_modifier_translation` (`id`, `light_modifier_analysis_method_id`, `language_id`, `name`) VALUES (5, 223, 1, 'Barn Door(s)');
INSERT INTO `FIPOP`.`light_modifier_translation` (`id`, `light_modifier_analysis_method_id`, `language_id`, `name`) VALUES (6, 224, 1, 'Light Tent');
INSERT INTO `FIPOP`.`light_modifier_translation` (`id`, `light_modifier_analysis_method_id`, `language_id`, `name`) VALUES (7, 225, 1, 'Ring Flash');
INSERT INTO `FIPOP`.`light_modifier_translation` (`id`, `light_modifier_analysis_method_id`, `language_id`, `name`) VALUES (8, 226, 1, 'Snoot');

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`light_position`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`light_position` (`analysis_method_id`) VALUES (188);
INSERT INTO `FIPOP`.`light_position` (`analysis_method_id`) VALUES (189);
INSERT INTO `FIPOP`.`light_position` (`analysis_method_id`) VALUES (190);
INSERT INTO `FIPOP`.`light_position` (`analysis_method_id`) VALUES (191);
INSERT INTO `FIPOP`.`light_position` (`analysis_method_id`) VALUES (192);
INSERT INTO `FIPOP`.`light_position` (`analysis_method_id`) VALUES (193);
INSERT INTO `FIPOP`.`light_position` (`analysis_method_id`) VALUES (194);

COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`light_position_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`light_position_translation` (`id`, `light_position_analysis_method_id`, `language_id`, `name`) VALUES (1, 188, 1, 'In Front of Object/Person');
INSERT INTO `FIPOP`.`light_position_translation` (`id`, `light_position_analysis_method_id`, `language_id`, `name`) VALUES (2, 189, 1, 'Behind Object/Person');
INSERT INTO `FIPOP`.`light_position_translation` (`id`, `light_position_analysis_method_id`, `language_id`, `name`) VALUES (3, 190, 1, 'To the Left of the Object/Person');
INSERT INTO `FIPOP`.`light_position_translation` (`id`, `light_position_analysis_method_id`, `language_id`, `name`) VALUES (4, 191, 1, 'To the Right of the Object/Person');
INSERT INTO `FIPOP`.`light_position_translation` (`id`, `light_position_analysis_method_id`, `language_id`, `name`) VALUES (5, 192, 1, 'Above the Object/Person');
INSERT INTO `FIPOP`.`light_position_translation` (`id`, `light_position_analysis_method_id`, `language_id`, `name`) VALUES (6, 193, 1, 'Below/the Object/Person');
INSERT INTO `FIPOP`.`light_position_translation` (`id`, `light_position_analysis_method_id`, `language_id`, `name`) VALUES (7, 194, 1, 'At an Angle');

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`light_position_angle_horizontal`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`light_position_angle_horizontal` (`analysis_method_id`) VALUES (195);
INSERT INTO `FIPOP`.`light_position_angle_horizontal` (`analysis_method_id`) VALUES (196);
INSERT INTO `FIPOP`.`light_position_angle_horizontal` (`analysis_method_id`) VALUES (197);
INSERT INTO `FIPOP`.`light_position_angle_horizontal` (`analysis_method_id`) VALUES (198);
INSERT INTO `FIPOP`.`light_position_angle_horizontal` (`analysis_method_id`) VALUES (199);
INSERT INTO `FIPOP`.`light_position_angle_horizontal` (`analysis_method_id`) VALUES (200);
INSERT INTO `FIPOP`.`light_position_angle_horizontal` (`analysis_method_id`) VALUES (201);
INSERT INTO `FIPOP`.`light_position_angle_horizontal` (`analysis_method_id`) VALUES (202);
INSERT INTO `FIPOP`.`light_position_angle_horizontal` (`analysis_method_id`) VALUES (203);
INSERT INTO `FIPOP`.`light_position_angle_horizontal` (`analysis_method_id`) VALUES (204);
INSERT INTO `FIPOP`.`light_position_angle_horizontal` (`analysis_method_id`) VALUES (205);
INSERT INTO `FIPOP`.`light_position_angle_horizontal` (`analysis_method_id`) VALUES (206);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`light_position_angle_horizontal_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`light_position_angle_horizontal_translation` (`id`, `light_position_angle_horizontal_analysis_method_id`, `language_id`, `name`) VALUES (1, 195, 1, '1 o\'clock');
INSERT INTO `FIPOP`.`light_position_angle_horizontal_translation` (`id`, `light_position_angle_horizontal_analysis_method_id`, `language_id`, `name`) VALUES (2, 196, 1, '2 o\'clock');
INSERT INTO `FIPOP`.`light_position_angle_horizontal_translation` (`id`, `light_position_angle_horizontal_analysis_method_id`, `language_id`, `name`) VALUES (3, 197, 1, '3 o\'clock');
INSERT INTO `FIPOP`.`light_position_angle_horizontal_translation` (`id`, `light_position_angle_horizontal_analysis_method_id`, `language_id`, `name`) VALUES (4, 198, 1, '4 o\'clock');
INSERT INTO `FIPOP`.`light_position_angle_horizontal_translation` (`id`, `light_position_angle_horizontal_analysis_method_id`, `language_id`, `name`) VALUES (5, 199, 1, '5 o\'clock');
INSERT INTO `FIPOP`.`light_position_angle_horizontal_translation` (`id`, `light_position_angle_horizontal_analysis_method_id`, `language_id`, `name`) VALUES (6, 200, 1, '6 o\'clock');
INSERT INTO `FIPOP`.`light_position_angle_horizontal_translation` (`id`, `light_position_angle_horizontal_analysis_method_id`, `language_id`, `name`) VALUES (7, 201, 1, '7 o\'clock');
INSERT INTO `FIPOP`.`light_position_angle_horizontal_translation` (`id`, `light_position_angle_horizontal_analysis_method_id`, `language_id`, `name`) VALUES (8, 202, 1, '8 o\'clock');
INSERT INTO `FIPOP`.`light_position_angle_horizontal_translation` (`id`, `light_position_angle_horizontal_analysis_method_id`, `language_id`, `name`) VALUES (9, 203, 1, '9 o\'clock');
INSERT INTO `FIPOP`.`light_position_angle_horizontal_translation` (`id`, `light_position_angle_horizontal_analysis_method_id`, `language_id`, `name`) VALUES (10, 204, 1, '10 o\'clock');
INSERT INTO `FIPOP`.`light_position_angle_horizontal_translation` (`id`, `light_position_angle_horizontal_analysis_method_id`, `language_id`, `name`) VALUES (11, 205, 1, '11 o\'clock');
INSERT INTO `FIPOP`.`light_position_angle_horizontal_translation` (`id`, `light_position_angle_horizontal_analysis_method_id`, `language_id`, `name`) VALUES (12, 206, 1, '12 o\'clock');

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`light_position_angle_vertical`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`light_position_angle_vertical` (`analysis_method_id`) VALUES (207);
INSERT INTO `FIPOP`.`light_position_angle_vertical` (`analysis_method_id`) VALUES (208);
INSERT INTO `FIPOP`.`light_position_angle_vertical` (`analysis_method_id`) VALUES (209);
INSERT INTO `FIPOP`.`light_position_angle_vertical` (`analysis_method_id`) VALUES (210);
INSERT INTO `FIPOP`.`light_position_angle_vertical` (`analysis_method_id`) VALUES (211);
INSERT INTO `FIPOP`.`light_position_angle_vertical` (`analysis_method_id`) VALUES (212);
INSERT INTO `FIPOP`.`light_position_angle_vertical` (`analysis_method_id`) VALUES (213);
INSERT INTO `FIPOP`.`light_position_angle_vertical` (`analysis_method_id`) VALUES (214);
INSERT INTO `FIPOP`.`light_position_angle_vertical` (`analysis_method_id`) VALUES (215);
INSERT INTO `FIPOP`.`light_position_angle_vertical` (`analysis_method_id`) VALUES (216);
INSERT INTO `FIPOP`.`light_position_angle_vertical` (`analysis_method_id`) VALUES (217);
INSERT INTO `FIPOP`.`light_position_angle_vertical` (`analysis_method_id`) VALUES (218);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`light_position_angle_vertical_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`light_position_angle_vertical_translation` (`id`, `light_position_angle_vertical_analysis_method_id`, `language_id`, `name`) VALUES (1, 207, 1, '1 o\'clock');
INSERT INTO `FIPOP`.`light_position_angle_vertical_translation` (`id`, `light_position_angle_vertical_analysis_method_id`, `language_id`, `name`) VALUES (2, 208, 1, '2 o\'clock');
INSERT INTO `FIPOP`.`light_position_angle_vertical_translation` (`id`, `light_position_angle_vertical_analysis_method_id`, `language_id`, `name`) VALUES (3, 209, 1, '3 o\'clock');
INSERT INTO `FIPOP`.`light_position_angle_vertical_translation` (`id`, `light_position_angle_vertical_analysis_method_id`, `language_id`, `name`) VALUES (4, 210, 1, '4 o\'clock');
INSERT INTO `FIPOP`.`light_position_angle_vertical_translation` (`id`, `light_position_angle_vertical_analysis_method_id`, `language_id`, `name`) VALUES (5, 211, 1, '5 o\'clock');
INSERT INTO `FIPOP`.`light_position_angle_vertical_translation` (`id`, `light_position_angle_vertical_analysis_method_id`, `language_id`, `name`) VALUES (6, 212, 1, '6 o\'clock');
INSERT INTO `FIPOP`.`light_position_angle_vertical_translation` (`id`, `light_position_angle_vertical_analysis_method_id`, `language_id`, `name`) VALUES (7, 213, 1, '7 o\'clock');
INSERT INTO `FIPOP`.`light_position_angle_vertical_translation` (`id`, `light_position_angle_vertical_analysis_method_id`, `language_id`, `name`) VALUES (8, 214, 1, '8 o\'clock');
INSERT INTO `FIPOP`.`light_position_angle_vertical_translation` (`id`, `light_position_angle_vertical_analysis_method_id`, `language_id`, `name`) VALUES (9, 215, 1, '9 o\'clock');
INSERT INTO `FIPOP`.`light_position_angle_vertical_translation` (`id`, `light_position_angle_vertical_analysis_method_id`, `language_id`, `name`) VALUES (10, 216, 1, '10 o\'clock');
INSERT INTO `FIPOP`.`light_position_angle_vertical_translation` (`id`, `light_position_angle_vertical_analysis_method_id`, `language_id`, `name`) VALUES (11, 217, 1, '11 o\'clock');
INSERT INTO `FIPOP`.`light_position_angle_vertical_translation` (`id`, `light_position_angle_vertical_analysis_method_id`, `language_id`, `name`) VALUES (12, 218, 1, '12 o\'clock');

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`lighting_duration`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`lighting_duration` (`analysis_method_id`) VALUES (227);
INSERT INTO `FIPOP`.`lighting_duration` (`analysis_method_id`) VALUES (228);
INSERT INTO `FIPOP`.`lighting_duration` (`analysis_method_id`) VALUES (229);
INSERT INTO `FIPOP`.`lighting_duration` (`analysis_method_id`) VALUES (230);
INSERT INTO `FIPOP`.`lighting_duration` (`analysis_method_id`) VALUES (231);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`lighting_duration_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`lighting_duration_translation` (`id`, `lighting_duration_analysis_method_id`, `language_id`, `name`) VALUES (1, 227, 1, 'Constant Light (e.g. lamp)');
INSERT INTO `FIPOP`.`lighting_duration_translation` (`id`, `lighting_duration_analysis_method_id`, `language_id`, `name`) VALUES (2, 228, 1, 'Cyclical Lighting (e.g. pulsing light)');
INSERT INTO `FIPOP`.`lighting_duration_translation` (`id`, `lighting_duration_analysis_method_id`, `language_id`, `name`) VALUES (3, 229, 1, 'Natural Lighting (e.g. the sun, bioluminescence)');
INSERT INTO `FIPOP`.`lighting_duration_translation` (`id`, `lighting_duration_analysis_method_id`, `language_id`, `name`) VALUES (4, 230, 1, 'Photography Flash');
INSERT INTO `FIPOP`.`lighting_duration_translation` (`id`, `lighting_duration_analysis_method_id`, `language_id`, `name`) VALUES (5, 231, 1, 'Irregular Lighting (e.g. flickering candles, halogen light)');

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`lighting_type`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`lighting_type` (`analysis_method_id`) VALUES (69);
INSERT INTO `FIPOP`.`lighting_type` (`analysis_method_id`) VALUES (70);
INSERT INTO `FIPOP`.`lighting_type` (`analysis_method_id`) VALUES (71);
INSERT INTO `FIPOP`.`lighting_type` (`analysis_method_id`) VALUES (72);
INSERT INTO `FIPOP`.`lighting_type` (`analysis_method_id`) VALUES (73);
INSERT INTO `FIPOP`.`lighting_type` (`analysis_method_id`) VALUES (74);
INSERT INTO `FIPOP`.`lighting_type` (`analysis_method_id`) VALUES (75);
INSERT INTO `FIPOP`.`lighting_type` (`analysis_method_id`) VALUES (76);
INSERT INTO `FIPOP`.`lighting_type` (`analysis_method_id`) VALUES (77);
INSERT INTO `FIPOP`.`lighting_type` (`analysis_method_id`) VALUES (78);
INSERT INTO `FIPOP`.`lighting_type` (`analysis_method_id`) VALUES (79);
INSERT INTO `FIPOP`.`lighting_type` (`analysis_method_id`) VALUES (80);
INSERT INTO `FIPOP`.`lighting_type` (`analysis_method_id`) VALUES (81);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`lighting_type_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`lighting_type_translation` (`id`, `lighting_type_analysis_method_id`, `language_id`, `name`) VALUES (1, 69, 1, 'Natural Lighting');
INSERT INTO `FIPOP`.`lighting_type_translation` (`id`, `lighting_type_analysis_method_id`, `language_id`, `name`) VALUES (2, 70, 1, 'Key Lighting (Hauptausleuchtung des Bildobjekts / der Person)');
INSERT INTO `FIPOP`.`lighting_type_translation` (`id`, `lighting_type_analysis_method_id`, `language_id`, `name`) VALUES (3, 71, 1, 'High Key Lighting (helle Töne dominant)');
INSERT INTO `FIPOP`.`lighting_type_translation` (`id`, `lighting_type_analysis_method_id`, `language_id`, `name`) VALUES (4, 72, 1, 'Low Key Lighting (dunkle Töne dominieren)');
INSERT INTO `FIPOP`.`lighting_type_translation` (`id`, `lighting_type_analysis_method_id`, `language_id`, `name`) VALUES (5, 73, 1, 'Fill Lighting (löscht Schatten, die vom Key Light verursacht werden)');
INSERT INTO `FIPOP`.`lighting_type_translation` (`id`, `lighting_type_analysis_method_id`, `language_id`, `name`) VALUES (6, 74, 1, 'Back Lighting (Lichtquelle hinter Bildobjekt)');
INSERT INTO `FIPOP`.`lighting_type_translation` (`id`, `lighting_type_analysis_method_id`, `language_id`, `name`) VALUES (7, 75, 1, 'Practical Lighting (Lichtquellen im Bild; unterstützt den Raumeindruck)');
INSERT INTO `FIPOP`.`lighting_type_translation` (`id`, `lighting_type_analysis_method_id`, `language_id`, `name`) VALUES (8, 76, 1, 'Hard /Spot Lighting (\"Glanzlicht\"; konzentriert, scharfe Schattenkonturen)');
INSERT INTO `FIPOP`.`lighting_type_translation` (`id`, `lighting_type_analysis_method_id`, `language_id`, `name`) VALUES (9, 77, 1, 'Soft Lighting (diffus, weiche Schattenkonturen)');
INSERT INTO `FIPOP`.`lighting_type_translation` (`id`, `lighting_type_analysis_method_id`, `language_id`, `name`) VALUES (10, 78, 1, 'Bounce Lighting (flächiges Licht)');
INSERT INTO `FIPOP`.`lighting_type_translation` (`id`, `lighting_type_analysis_method_id`, `language_id`, `name`) VALUES (11, 79, 1, 'Chiaoscuro / Side Lighting (starke Hell-Dunkel-Kontraste im Bild)');
INSERT INTO `FIPOP`.`lighting_type_translation` (`id`, `lighting_type_analysis_method_id`, `language_id`, `name`) VALUES (12, 80, 1, 'Motivated Lighting (immitiert natürliches Licht)');
INSERT INTO `FIPOP`.`lighting_type_translation` (`id`, `lighting_type_analysis_method_id`, `language_id`, `name`) VALUES (13, 81, 1, 'Ambient Lighting (schafft eine atmosphärische Raumausleuchtung)');

COMMIT;