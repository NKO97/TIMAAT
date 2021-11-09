ALTER TABLE `FIPOP`.`analysis_method_type_translation` CHANGE `analysis_method_type_id` `analysis_method_type_id` INT(11) NOT NULL AFTER `id`;

-- -----------------------------------------------------
-- Table `FIPOP`.`acting_technique`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`acting_technique` (
  `analysis_method_id` INT NOT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_acting_technique_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `FIPOP`.`acting_technique_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`acting_technique_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `acting_technique_analysis_method_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_acting_technique_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_acting_technique_translation_acting_technique1`
    FOREIGN KEY (`acting_technique_analysis_method_id`)
    REFERENCES `FIPOP`.`acting_technique` (`analysis_method_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_acting_technique_translation_language1_idx` ON `FIPOP`.`acting_technique_translation` (`language_id` ASC);

CREATE INDEX `fk_acting_technique_translation_acting_technique1_idx` ON `FIPOP`.`acting_technique_translation` (`acting_technique_analysis_method_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`facial_expression`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`facial_expression` (
  `analysis_method_id` INT NOT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_facial_expression_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `FIPOP`.`facial_expression_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`facial_expression_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `facial_expression_analysis_method_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_facial_expression_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_facial_expression_translation_facial_expression1`
    FOREIGN KEY (`facial_expression_analysis_method_id`)
    REFERENCES `FIPOP`.`facial_expression` (`analysis_method_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_facial_expression_translation_language1_idx` ON `FIPOP`.`facial_expression_translation` (`language_id` ASC);

CREATE INDEX `fk_facial_expression_translation_facial_expression1_idx` ON `FIPOP`.`facial_expression_translation` (`facial_expression_analysis_method_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`facial_expression_intensity`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`facial_expression_intensity` (
  `analysis_method_id` INT NOT NULL,
  `value` TINYINT UNSIGNED NOT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_facial_expression_intensity_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FIPOP`.`facial_expression_intensity_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`facial_expression_intensity_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `facial_expression_intensity_analysis_method_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `name` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_facial_expression_intensity_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_facial_expression_intensity_translation_facial_expression_1`
    FOREIGN KEY (`facial_expression_intensity_analysis_method_id`)
    REFERENCES `FIPOP`.`facial_expression_intensity` (`analysis_method_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_facial_expression_intensity_translation_language1_idx` ON `FIPOP`.`facial_expression_intensity_translation` (`language_id` ASC);

CREATE INDEX `fk_facial_expression_intensity_translation_facial_expressio_idx` ON `FIPOP`.`facial_expression_intensity_translation` (`facial_expression_intensity_analysis_method_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`gestural_emotion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`gestural_emotion` (
  `analysis_method_id` INT NOT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_gestural_emotion_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `FIPOP`.`gestural_emotion_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`gestural_emotion_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `gestural_emotion_analysis_method_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_gestural_emotion_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_gestural_emotion_translation_gestural_emotion1`
    FOREIGN KEY (`gestural_emotion_analysis_method_id`)
    REFERENCES `FIPOP`.`gestural_emotion` (`analysis_method_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_gestural_emotion_translation_language1_idx` ON `FIPOP`.`gestural_emotion_translation` (`language_id` ASC);

CREATE INDEX `fk_gestural_emotion_translation_gestural_emotion1_idx` ON `FIPOP`.`gestural_emotion_translation` (`gestural_emotion_analysis_method_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`gestural_emotion_intensity`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`gestural_emotion_intensity` (
  `analysis_method_id` INT NOT NULL,
  `value` TINYINT UNSIGNED NOT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_gestural_emotion_intensity_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_gestural_emotion_intensity_analysis_method1_idx` ON `FIPOP`.`gestural_emotion_intensity` (`analysis_method_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`gestural_emotion_intensity_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`gestural_emotion_intensity_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `gestural_emotion_intensity_analysis_method_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `name` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_gestural_emotion_intensity_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_gestural_emotion_intensity_translation_gestural_emotio1`
    FOREIGN KEY (`gestural_emotion_intensity_analysis_method_id`)
    REFERENCES `FIPOP`.`gestural_emotion_intensity` (`analysis_method_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_gestural_emotion_intensity_translation_language1_idx` ON `FIPOP`.`gestural_emotion_intensity_translation` (`language_id` ASC);

CREATE INDEX `fk_gestural_emotion_intensity_translation_gestural_emot_idx` ON `FIPOP`.`gestural_emotion_intensity_translation` (`gestural_emotion_intensity_analysis_method_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`physical_expression`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`physical_expression` (
  `analysis_method_id` INT NOT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_physical_expression_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `FIPOP`.`physical_expression_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`physical_expression_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `physical_expression_analysis_method_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_physical_expression_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_physical_expression_translation_physical_expression1`
    FOREIGN KEY (`physical_expression_analysis_method_id`)
    REFERENCES `FIPOP`.`physical_expression` (`analysis_method_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_physical_expression_translation_language1_idx` ON `FIPOP`.`physical_expression_translation` (`language_id` ASC);

CREATE INDEX `fk_physical_expression_translation_physical_expression1_idx` ON `FIPOP`.`physical_expression_translation` (`physical_expression_analysis_method_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`physical_expression_intensity`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`physical_expression_intensity` (
  `analysis_method_id` INT NOT NULL,
  `value` TINYINT UNSIGNED NOT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_physical_expression_intensity_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `FIPOP`.`physical_expression_intensity_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`physical_expression_intensity_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `physical_expression_intensity_analysis_method_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `name` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_physical_expression_intensity_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_physical_expression_intensity_translation_physical_express1`
    FOREIGN KEY (`physical_expression_intensity_analysis_method_id`)
    REFERENCES `FIPOP`.`physical_expression_intensity` (`analysis_method_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_physical_expression_intensity_translation_language1_idx` ON `FIPOP`.`physical_expression_intensity_translation` (`language_id` ASC);

CREATE INDEX `fk_physical_expression_intensity_translation_physical_expre_idx` ON `FIPOP`.`physical_expression_intensity_translation` (`physical_expression_intensity_analysis_method_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`analysis_actor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`analysis_actor` (
  `analysis_method_id` INT NOT NULL,
  `acting_technique_analysis_method_id` INT NULL,
  `facial_expression_analysis_method_id` INT NULL,
  `facial_expression_intensity_analysis_method_id` INT NULL,
  `physical_expression_analysis_method_id` INT NULL,
  `physical_expression_intensity_analysis_method_id` INT NULL,
  `gestural_emotion_analysis_method_id` INT NULL,
  `gestural_emotion_intensity_analysis_method_id` INT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_analysis_actor_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_analysis_actor_acting_technique1`
    FOREIGN KEY (`acting_technique_analysis_method_id`)
    REFERENCES `FIPOP`.`acting_technique` (`analysis_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_analysis_actor_facial_expression1`
    FOREIGN KEY (`facial_expression_analysis_method_id`)
    REFERENCES `FIPOP`.`facial_expression` (`analysis_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_analysis_actor_facial_expression_intensity1`
    FOREIGN KEY (`facial_expression_intensity_analysis_method_id`)
    REFERENCES `FIPOP`.`facial_expression_intensity` (`analysis_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_analysis_actor_physical_expression1`
    FOREIGN KEY (`physical_expression_analysis_method_id`)
    REFERENCES `FIPOP`.`physical_expression` (`analysis_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_analysis_actor_physical_expression_intensity1`
    FOREIGN KEY (`physical_expression_intensity_analysis_method_id`)
    REFERENCES `FIPOP`.`physical_expression_intensity` (`analysis_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_analysis_actor_gestural_emotion1`
    FOREIGN KEY (`gestural_emotion_analysis_method_id`)
    REFERENCES `FIPOP`.`gestural_emotion` (`analysis_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_analysis_actor_gestural_emotion_intensity1`
    FOREIGN KEY (`gestural_emotion_intensity_analysis_method_id`)
    REFERENCES `FIPOP`.`gestural_emotion_intensity` (`analysis_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_analysis_actor_acting_technique1_idx` ON `FIPOP`.`analysis_actor` (`acting_technique_analysis_method_id` ASC);

CREATE INDEX `fk_analysis_actor_facial_expression1_idx` ON `FIPOP`.`analysis_actor` (`facial_expression_analysis_method_id` ASC);

CREATE INDEX `fk_analysis_actor_facial_expression_intensity1_idx` ON `FIPOP`.`analysis_actor` (`facial_expression_intensity_analysis_method_id` ASC);

CREATE INDEX `fk_analysis_actor_physical_expression1_idx` ON `FIPOP`.`analysis_actor` (`physical_expression_analysis_method_id` ASC);

CREATE INDEX `fk_analysis_actor_physical_expression_intensity1_idx` ON `FIPOP`.`analysis_actor` (`physical_expression_intensity_analysis_method_id` ASC);

CREATE INDEX `fk_analysis_actor_gestural_emotion1_idx` ON `FIPOP`.`analysis_actor` (`gestural_emotion_analysis_method_id` ASC);

CREATE INDEX `fk_analysis_actor_gestural_emotion_intensity1_idx` ON `FIPOP`.`analysis_actor` (`gestural_emotion_intensity_analysis_method_id` ASC);


-- -----------------------------------------------------
-- Data for table `FIPOP`.`analysis_method_type`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`, `layer_visual`, `layer_audio`) VALUES (44, 0, 1, 0);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`, `layer_visual`, `layer_audio`) VALUES (45, 1, 1, 0);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`, `layer_visual`, `layer_audio`) VALUES (46, 1, 1, 0);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`, `layer_visual`, `layer_audio`) VALUES (47, 1, 1, 0);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`, `layer_visual`, `layer_audio`) VALUES (48, 1, 1, 0);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`, `layer_visual`, `layer_audio`) VALUES (49, 1, 1, 0);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`, `layer_visual`, `layer_audio`) VALUES (50, 1, 1, 0);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`, `layer_visual`, `layer_audio`) VALUES (51, 1, 1, 0);
COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`analysis_method`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (232, 45);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (233, 45);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (234, 45);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (235, 45);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (236, 45);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (237, 45);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (238, 45);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (239, 45);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (240, 45);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (241, 45);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (242, 45);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (243, 45);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (244, 45);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (245, 46);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (246, 46);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (247, 46);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (248, 46);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (249, 46);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (250, 46);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (251, 46);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (252, 46);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (253, 46);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (254, 46);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (255, 46);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (256, 46);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (257, 46);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (258, 46);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (259, 46);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (260, 47);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (261, 47);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (262, 47);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (263, 47);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (264, 47);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (265, 48);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (266, 48);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (267, 48);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (268, 48);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (269, 48);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (270, 48);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (271, 48);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (272, 48);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (273, 48);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (274, 48);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (275, 48);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (276, 48);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (277, 48);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (278, 48);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (279, 48);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (280, 49);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (281, 49);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (282, 49);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (283, 49);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (284, 49);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (285, 50);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (286, 50);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (287, 50);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (288, 50);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (289, 50);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (290, 50);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (291, 50);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (292, 50);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (293, 50);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (294, 50);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (295, 50);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (296, 50);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (297, 50);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (298, 50);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (299, 50);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (300, 51);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (301, 51);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (302, 51);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (303, 51);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (304, 51);
COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`analysis_method_type_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `analysis_method_type_id`, `language_id`, `name`) VALUES (44, 44, 1, 'AnalysisActor');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `analysis_method_type_id`, `language_id`, `name`) VALUES (45, 45, 1, 'ActingTechnique');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `analysis_method_type_id`, `language_id`, `name`) VALUES (46, 46, 1, 'FacialExpression');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `analysis_method_type_id`, `language_id`, `name`) VALUES (47, 47, 1, 'FacialExpressionIntensity');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `analysis_method_type_id`, `language_id`, `name`) VALUES (48, 48, 1, 'PhysicalExpression');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `analysis_method_type_id`, `language_id`, `name`) VALUES (49, 49, 1, 'PhysicalExpression');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `analysis_method_type_id`, `language_id`, `name`) VALUES (50, 50, 1, 'GesturalEmotion');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `analysis_method_type_id`, `language_id`, `name`) VALUES (51, 51, 1, 'GesturalEmotionIntensity');
COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`acting_technique`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`acting_technique` (`analysis_method_id`) VALUES (232);
INSERT INTO `FIPOP`.`acting_technique` (`analysis_method_id`) VALUES (233);
INSERT INTO `FIPOP`.`acting_technique` (`analysis_method_id`) VALUES (234);
INSERT INTO `FIPOP`.`acting_technique` (`analysis_method_id`) VALUES (235);
INSERT INTO `FIPOP`.`acting_technique` (`analysis_method_id`) VALUES (236);
INSERT INTO `FIPOP`.`acting_technique` (`analysis_method_id`) VALUES (237);
INSERT INTO `FIPOP`.`acting_technique` (`analysis_method_id`) VALUES (238);
INSERT INTO `FIPOP`.`acting_technique` (`analysis_method_id`) VALUES (239);
INSERT INTO `FIPOP`.`acting_technique` (`analysis_method_id`) VALUES (240);
INSERT INTO `FIPOP`.`acting_technique` (`analysis_method_id`) VALUES (241);
INSERT INTO `FIPOP`.`acting_technique` (`analysis_method_id`) VALUES (242);
INSERT INTO `FIPOP`.`acting_technique` (`analysis_method_id`) VALUES (243);
INSERT INTO `FIPOP`.`acting_technique` (`analysis_method_id`) VALUES (244);
COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`acting_technique_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`acting_technique_translation` (`id`, `acting_technique_analysis_method_id`, `language_id`, `name`) VALUES (1, 232, 1, 'Classical Acting');
INSERT INTO `FIPOP`.`acting_technique_translation` (`id`, `acting_technique_analysis_method_id`, `language_id`, `name`) VALUES (2, 233, 1, 'Modern Acting');
INSERT INTO `FIPOP`.`acting_technique_translation` (`id`, `acting_technique_analysis_method_id`, `language_id`, `name`) VALUES (3, 234, 1, 'Method Acting (e.g. Strasner Technique, Adler Technique)');
INSERT INTO `FIPOP`.`acting_technique_translation` (`id`, `acting_technique_analysis_method_id`, `language_id`, `name`) VALUES (4, 235, 1, 'Meisner Technique');
INSERT INTO `FIPOP`.`acting_technique_translation` (`id`, `acting_technique_analysis_method_id`, `language_id`, `name`) VALUES (5, 236, 1, 'Chekov Technique');
INSERT INTO `FIPOP`.`acting_technique_translation` (`id`, `acting_technique_analysis_method_id`, `language_id`, `name`) VALUES (6, 237, 1, 'Theater Acting (commercial)');
INSERT INTO `FIPOP`.`acting_technique_translation` (`id`, `acting_technique_analysis_method_id`, `language_id`, `name`) VALUES (7, 238, 1, 'Theater Acting (cultural)');
INSERT INTO `FIPOP`.`acting_technique_translation` (`id`, `acting_technique_analysis_method_id`, `language_id`, `name`) VALUES (8, 239, 1, 'Theater Acting (political/propagandistic)');
INSERT INTO `FIPOP`.`acting_technique_translation` (`id`, `acting_technique_analysis_method_id`, `language_id`, `name`) VALUES (9, 240, 1, 'Theater Acting (existential/naturalistic/experimental/metaphysical)');
INSERT INTO `FIPOP`.`acting_technique_translation` (`id`, `acting_technique_analysis_method_id`, `language_id`, `name`) VALUES (10, 241, 1, 'Layman Acting / Layman Staging');
INSERT INTO `FIPOP`.`acting_technique_translation` (`id`, `acting_technique_analysis_method_id`, `language_id`, `name`) VALUES (11, 242, 1, 'Not Acting');
INSERT INTO `FIPOP`.`acting_technique_translation` (`id`, `acting_technique_analysis_method_id`, `language_id`, `name`) VALUES (12, 243, 1, 'Not an Actor');
INSERT INTO `FIPOP`.`acting_technique_translation` (`id`, `acting_technique_analysis_method_id`, `language_id`, `name`) VALUES (13, 244, 1, 'Other');
COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`facial_expression`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`facial_expression` (`analysis_method_id`) VALUES (245);
INSERT INTO `FIPOP`.`facial_expression` (`analysis_method_id`) VALUES (246);
INSERT INTO `FIPOP`.`facial_expression` (`analysis_method_id`) VALUES (247);
INSERT INTO `FIPOP`.`facial_expression` (`analysis_method_id`) VALUES (248);
INSERT INTO `FIPOP`.`facial_expression` (`analysis_method_id`) VALUES (249);
INSERT INTO `FIPOP`.`facial_expression` (`analysis_method_id`) VALUES (250);
INSERT INTO `FIPOP`.`facial_expression` (`analysis_method_id`) VALUES (251);
INSERT INTO `FIPOP`.`facial_expression` (`analysis_method_id`) VALUES (252);
INSERT INTO `FIPOP`.`facial_expression` (`analysis_method_id`) VALUES (253);
INSERT INTO `FIPOP`.`facial_expression` (`analysis_method_id`) VALUES (254);
INSERT INTO `FIPOP`.`facial_expression` (`analysis_method_id`) VALUES (255);
INSERT INTO `FIPOP`.`facial_expression` (`analysis_method_id`) VALUES (256);
INSERT INTO `FIPOP`.`facial_expression` (`analysis_method_id`) VALUES (257);
INSERT INTO `FIPOP`.`facial_expression` (`analysis_method_id`) VALUES (258);
INSERT INTO `FIPOP`.`facial_expression` (`analysis_method_id`) VALUES (259);
COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`facial_expression_intensity`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`facial_expression_intensity` (`analysis_method_id`, `value`) VALUES (260, 1);
INSERT INTO `FIPOP`.`facial_expression_intensity` (`analysis_method_id`, `value`) VALUES (261, 2);
INSERT INTO `FIPOP`.`facial_expression_intensity` (`analysis_method_id`, `value`) VALUES (262, 3);
INSERT INTO `FIPOP`.`facial_expression_intensity` (`analysis_method_id`, `value`) VALUES (263, 4);
INSERT INTO `FIPOP`.`facial_expression_intensity` (`analysis_method_id`, `value`) VALUES (264, 5);
COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`facial_expression_intensity_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`facial_expression_intensity_translation` (`id`, `facial_expression_intensity_analysis_method_id`, `language_id`, `name`) VALUES (1, 260, 1, '(weak)');
INSERT INTO `FIPOP`.`facial_expression_intensity_translation` (`id`, `facial_expression_intensity_analysis_method_id`, `language_id`, `name`) VALUES (2, 261, 1, '');
INSERT INTO `FIPOP`.`facial_expression_intensity_translation` (`id`, `facial_expression_intensity_analysis_method_id`, `language_id`, `name`) VALUES (3, 262, 1, '(average)');
INSERT INTO `FIPOP`.`facial_expression_intensity_translation` (`id`, `facial_expression_intensity_analysis_method_id`, `language_id`, `name`) VALUES (4, 263, 1, '');
INSERT INTO `FIPOP`.`facial_expression_intensity_translation` (`id`, `facial_expression_intensity_analysis_method_id`, `language_id`, `name`) VALUES (5, 264, 1, '(intense)');
COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`facial_expression_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`facial_expression_translation` (`id`, `facial_expression_analysis_method_id`, `language_id`, `name`) VALUES (1, 245, 1, 'friendly');
INSERT INTO `FIPOP`.`facial_expression_translation` (`id`, `facial_expression_analysis_method_id`, `language_id`, `name`) VALUES (2, 246, 1, 'happy');
INSERT INTO `FIPOP`.`facial_expression_translation` (`id`, `facial_expression_analysis_method_id`, `language_id`, `name`) VALUES (3, 247, 1, 'loving');
INSERT INTO `FIPOP`.`facial_expression_translation` (`id`, `facial_expression_analysis_method_id`, `language_id`, `name`) VALUES (4, 248, 1, 'caressing');
INSERT INTO `FIPOP`.`facial_expression_translation` (`id`, `facial_expression_analysis_method_id`, `language_id`, `name`) VALUES (5, 249, 1, 'inviting');
INSERT INTO `FIPOP`.`facial_expression_translation` (`id`, `facial_expression_analysis_method_id`, `language_id`, `name`) VALUES (6, 250, 1, 'relaxed');
INSERT INTO `FIPOP`.`facial_expression_translation` (`id`, `facial_expression_analysis_method_id`, `language_id`, `name`) VALUES (7, 251, 1, 'consious');
INSERT INTO `FIPOP`.`facial_expression_translation` (`id`, `facial_expression_analysis_method_id`, `language_id`, `name`) VALUES (8, 252, 1, 'self-conscious');
INSERT INTO `FIPOP`.`facial_expression_translation` (`id`, `facial_expression_analysis_method_id`, `language_id`, `name`) VALUES (9, 253, 1, 'insecure');
INSERT INTO `FIPOP`.`facial_expression_translation` (`id`, `facial_expression_analysis_method_id`, `language_id`, `name`) VALUES (10, 254, 1, 'scared');
INSERT INTO `FIPOP`.`facial_expression_translation` (`id`, `facial_expression_analysis_method_id`, `language_id`, `name`) VALUES (11, 255, 1, 'angry');
INSERT INTO `FIPOP`.`facial_expression_translation` (`id`, `facial_expression_analysis_method_id`, `language_id`, `name`) VALUES (12, 256, 1, 'furious');
INSERT INTO `FIPOP`.`facial_expression_translation` (`id`, `facial_expression_analysis_method_id`, `language_id`, `name`) VALUES (13, 257, 1, 'disgusted');
INSERT INTO `FIPOP`.`facial_expression_translation` (`id`, `facial_expression_analysis_method_id`, `language_id`, `name`) VALUES (14, 258, 1, 'suffering');
INSERT INTO `FIPOP`.`facial_expression_translation` (`id`, `facial_expression_analysis_method_id`, `language_id`, `name`) VALUES (15, 259, 1, 'surprised');
COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`gestural_emotion`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`gestural_emotion` (`analysis_method_id`) VALUES (285);
INSERT INTO `FIPOP`.`gestural_emotion` (`analysis_method_id`) VALUES (286);
INSERT INTO `FIPOP`.`gestural_emotion` (`analysis_method_id`) VALUES (287);
INSERT INTO `FIPOP`.`gestural_emotion` (`analysis_method_id`) VALUES (288);
INSERT INTO `FIPOP`.`gestural_emotion` (`analysis_method_id`) VALUES (289);
INSERT INTO `FIPOP`.`gestural_emotion` (`analysis_method_id`) VALUES (290);
INSERT INTO `FIPOP`.`gestural_emotion` (`analysis_method_id`) VALUES (291);
INSERT INTO `FIPOP`.`gestural_emotion` (`analysis_method_id`) VALUES (292);
INSERT INTO `FIPOP`.`gestural_emotion` (`analysis_method_id`) VALUES (293);
INSERT INTO `FIPOP`.`gestural_emotion` (`analysis_method_id`) VALUES (294);
INSERT INTO `FIPOP`.`gestural_emotion` (`analysis_method_id`) VALUES (295);
INSERT INTO `FIPOP`.`gestural_emotion` (`analysis_method_id`) VALUES (296);
INSERT INTO `FIPOP`.`gestural_emotion` (`analysis_method_id`) VALUES (297);
INSERT INTO `FIPOP`.`gestural_emotion` (`analysis_method_id`) VALUES (298);
INSERT INTO `FIPOP`.`gestural_emotion` (`analysis_method_id`) VALUES (299);
COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`gestural_emotion_intensity`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`gestural_emotion_intensity` (`analysis_method_id`, `value`) VALUES (300, 1);
INSERT INTO `FIPOP`.`gestural_emotion_intensity` (`analysis_method_id`, `value`) VALUES (301, 2);
INSERT INTO `FIPOP`.`gestural_emotion_intensity` (`analysis_method_id`, `value`) VALUES (302, 3);
INSERT INTO `FIPOP`.`gestural_emotion_intensity` (`analysis_method_id`, `value`) VALUES (303, 4);
INSERT INTO `FIPOP`.`gestural_emotion_intensity` (`analysis_method_id`, `value`) VALUES (304, 5);
COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`gestural_emotion_intensity_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`gestural_emotion_intensity_translation` (`id`, `gestural_emotion_intensity_analysis_method_id`, `language_id`, `name`) VALUES (1, 300, 1, '(weak)');
INSERT INTO `FIPOP`.`gestural_emotion_intensity_translation` (`id`, `gestural_emotion_intensity_analysis_method_id`, `language_id`, `name`) VALUES (2, 301, 1, '');
INSERT INTO `FIPOP`.`gestural_emotion_intensity_translation` (`id`, `gestural_emotion_intensity_analysis_method_id`, `language_id`, `name`) VALUES (3, 302, 1, '(average)');
INSERT INTO `FIPOP`.`gestural_emotion_intensity_translation` (`id`, `gestural_emotion_intensity_analysis_method_id`, `language_id`, `name`) VALUES (4, 303, 1, '');
INSERT INTO `FIPOP`.`gestural_emotion_intensity_translation` (`id`, `gestural_emotion_intensity_analysis_method_id`, `language_id`, `name`) VALUES (5, 304, 1, '(intense)');
COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`gestural_emotion_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`gestural_emotion_translation` (`id`, `gestural_emotion_analysis_method_id`, `language_id`, `name`) VALUES (1, 285, 1, 'friendly');
INSERT INTO `FIPOP`.`gestural_emotion_translation` (`id`, `gestural_emotion_analysis_method_id`, `language_id`, `name`) VALUES (2, 286, 1, 'happy');
INSERT INTO `FIPOP`.`gestural_emotion_translation` (`id`, `gestural_emotion_analysis_method_id`, `language_id`, `name`) VALUES (3, 287, 1, 'loving');
INSERT INTO `FIPOP`.`gestural_emotion_translation` (`id`, `gestural_emotion_analysis_method_id`, `language_id`, `name`) VALUES (4, 288, 1, 'caressing');
INSERT INTO `FIPOP`.`gestural_emotion_translation` (`id`, `gestural_emotion_analysis_method_id`, `language_id`, `name`) VALUES (5, 289, 1, 'inviting');
INSERT INTO `FIPOP`.`gestural_emotion_translation` (`id`, `gestural_emotion_analysis_method_id`, `language_id`, `name`) VALUES (6, 290, 1, 'relaxed');
INSERT INTO `FIPOP`.`gestural_emotion_translation` (`id`, `gestural_emotion_analysis_method_id`, `language_id`, `name`) VALUES (7, 291, 1, 'conscious');
INSERT INTO `FIPOP`.`gestural_emotion_translation` (`id`, `gestural_emotion_analysis_method_id`, `language_id`, `name`) VALUES (8, 292, 1, 'self-conscious');
INSERT INTO `FIPOP`.`gestural_emotion_translation` (`id`, `gestural_emotion_analysis_method_id`, `language_id`, `name`) VALUES (9, 293, 1, 'insecure');
INSERT INTO `FIPOP`.`gestural_emotion_translation` (`id`, `gestural_emotion_analysis_method_id`, `language_id`, `name`) VALUES (10, 294, 1, 'scared');
INSERT INTO `FIPOP`.`gestural_emotion_translation` (`id`, `gestural_emotion_analysis_method_id`, `language_id`, `name`) VALUES (11, 295, 1, 'angry');
INSERT INTO `FIPOP`.`gestural_emotion_translation` (`id`, `gestural_emotion_analysis_method_id`, `language_id`, `name`) VALUES (12, 296, 1, 'furious');
INSERT INTO `FIPOP`.`gestural_emotion_translation` (`id`, `gestural_emotion_analysis_method_id`, `language_id`, `name`) VALUES (13, 297, 1, 'disgusted');
INSERT INTO `FIPOP`.`gestural_emotion_translation` (`id`, `gestural_emotion_analysis_method_id`, `language_id`, `name`) VALUES (14, 298, 1, 'suffering');
INSERT INTO `FIPOP`.`gestural_emotion_translation` (`id`, `gestural_emotion_analysis_method_id`, `language_id`, `name`) VALUES (15, 299, 1, 'surprised');
COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`physical_expression`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`physical_expression` (`analysis_method_id`) VALUES (265);
INSERT INTO `FIPOP`.`physical_expression` (`analysis_method_id`) VALUES (266);
INSERT INTO `FIPOP`.`physical_expression` (`analysis_method_id`) VALUES (267);
INSERT INTO `FIPOP`.`physical_expression` (`analysis_method_id`) VALUES (268);
INSERT INTO `FIPOP`.`physical_expression` (`analysis_method_id`) VALUES (269);
INSERT INTO `FIPOP`.`physical_expression` (`analysis_method_id`) VALUES (270);
INSERT INTO `FIPOP`.`physical_expression` (`analysis_method_id`) VALUES (271);
INSERT INTO `FIPOP`.`physical_expression` (`analysis_method_id`) VALUES (272);
INSERT INTO `FIPOP`.`physical_expression` (`analysis_method_id`) VALUES (273);
INSERT INTO `FIPOP`.`physical_expression` (`analysis_method_id`) VALUES (274);
INSERT INTO `FIPOP`.`physical_expression` (`analysis_method_id`) VALUES (275);
INSERT INTO `FIPOP`.`physical_expression` (`analysis_method_id`) VALUES (276);
INSERT INTO `FIPOP`.`physical_expression` (`analysis_method_id`) VALUES (277);
INSERT INTO `FIPOP`.`physical_expression` (`analysis_method_id`) VALUES (278);
INSERT INTO `FIPOP`.`physical_expression` (`analysis_method_id`) VALUES (279);
COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`physical_expression_intensity`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`physical_expression_intensity` (`analysis_method_id`, `value`) VALUES (280, 1);
INSERT INTO `FIPOP`.`physical_expression_intensity` (`analysis_method_id`, `value`) VALUES (281, 2);
INSERT INTO `FIPOP`.`physical_expression_intensity` (`analysis_method_id`, `value`) VALUES (282, 3);
INSERT INTO `FIPOP`.`physical_expression_intensity` (`analysis_method_id`, `value`) VALUES (283, 4);
INSERT INTO `FIPOP`.`physical_expression_intensity` (`analysis_method_id`, `value`) VALUES (284, 5);
COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`physical_expression_intensity_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`physical_expression_intensity_translation` (`id`, `physical_expression_intensity_analysis_method_id`, `language_id`, `name`) VALUES (1, 280, 1, '(weak)');
INSERT INTO `FIPOP`.`physical_expression_intensity_translation` (`id`, `physical_expression_intensity_analysis_method_id`, `language_id`, `name`) VALUES (2, 281, 1, '');
INSERT INTO `FIPOP`.`physical_expression_intensity_translation` (`id`, `physical_expression_intensity_analysis_method_id`, `language_id`, `name`) VALUES (3, 282, 1, '(average)');
INSERT INTO `FIPOP`.`physical_expression_intensity_translation` (`id`, `physical_expression_intensity_analysis_method_id`, `language_id`, `name`) VALUES (4, 283, 1, '');
INSERT INTO `FIPOP`.`physical_expression_intensity_translation` (`id`, `physical_expression_intensity_analysis_method_id`, `language_id`, `name`) VALUES (5, 284, 1, '(intense)');
COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`physical_expression_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`physical_expression_translation` (`id`, `physical_expression_analysis_method_id`, `language_id`, `name`) VALUES (1, 265, 1, 'friendly');
INSERT INTO `FIPOP`.`physical_expression_translation` (`id`, `physical_expression_analysis_method_id`, `language_id`, `name`) VALUES (2, 266, 1, 'happy');
INSERT INTO `FIPOP`.`physical_expression_translation` (`id`, `physical_expression_analysis_method_id`, `language_id`, `name`) VALUES (3, 267, 1, 'loving');
INSERT INTO `FIPOP`.`physical_expression_translation` (`id`, `physical_expression_analysis_method_id`, `language_id`, `name`) VALUES (4, 268, 1, 'caressing');
INSERT INTO `FIPOP`.`physical_expression_translation` (`id`, `physical_expression_analysis_method_id`, `language_id`, `name`) VALUES (5, 269, 1, 'inviting');
INSERT INTO `FIPOP`.`physical_expression_translation` (`id`, `physical_expression_analysis_method_id`, `language_id`, `name`) VALUES (6, 270, 1, 'relaxed');
INSERT INTO `FIPOP`.`physical_expression_translation` (`id`, `physical_expression_analysis_method_id`, `language_id`, `name`) VALUES (7, 271, 1, 'conscious');
INSERT INTO `FIPOP`.`physical_expression_translation` (`id`, `physical_expression_analysis_method_id`, `language_id`, `name`) VALUES (8, 272, 1, 'self-conscious');
INSERT INTO `FIPOP`.`physical_expression_translation` (`id`, `physical_expression_analysis_method_id`, `language_id`, `name`) VALUES (9, 273, 1, 'insecure');
INSERT INTO `FIPOP`.`physical_expression_translation` (`id`, `physical_expression_analysis_method_id`, `language_id`, `name`) VALUES (10, 274, 1, 'scaled');
INSERT INTO `FIPOP`.`physical_expression_translation` (`id`, `physical_expression_analysis_method_id`, `language_id`, `name`) VALUES (11, 275, 1, 'angry');
INSERT INTO `FIPOP`.`physical_expression_translation` (`id`, `physical_expression_analysis_method_id`, `language_id`, `name`) VALUES (12, 276, 1, 'furious');
INSERT INTO `FIPOP`.`physical_expression_translation` (`id`, `physical_expression_analysis_method_id`, `language_id`, `name`) VALUES (13, 277, 1, 'disgusted');
INSERT INTO `FIPOP`.`physical_expression_translation` (`id`, `physical_expression_analysis_method_id`, `language_id`, `name`) VALUES (14, 278, 1, 'suffering');
INSERT INTO `FIPOP`.`physical_expression_translation` (`id`, `physical_expression_analysis_method_id`, `language_id`, `name`) VALUES (15, 279, 1, 'surprised');
COMMIT;