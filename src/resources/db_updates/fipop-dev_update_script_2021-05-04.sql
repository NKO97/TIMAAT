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

-- -----------------------------------------------------
-- Data for table `FIPOP`.`analysis_method_type`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (35, 1);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (36, 1);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (37, 1);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`analysis_method`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
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

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`analysis_method_type_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
UPDATE `FIPOP`.`analysis_method_type_translation` SET `name` = 'ConceptCameraPositionAndPerspective' WHERE `analysis_method_type_translation`.`id` = 8;
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (35, 1, 35, 'ConceptDirection');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (36, 1, 36, 'CameraMovementCharacteristic');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (37, 1, 37, 'CameraMovementType');

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