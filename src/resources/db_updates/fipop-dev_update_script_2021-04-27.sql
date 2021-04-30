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

COMMIT;

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

COMMIT;

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

