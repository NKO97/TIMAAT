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
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (38, 1, 38, 'LightPositionGeneral');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (39, 1, 39, 'LightPositionAngleHorizontal');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (40, 1, 40, 'LightPositionAngleVertical');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (41, 1, 41, 'LightModifier');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (42, 1, 42, 'LightingDuration');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (43, 1, 43, 'Lighting');

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