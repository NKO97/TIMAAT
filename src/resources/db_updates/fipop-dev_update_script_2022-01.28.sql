ALTER TABLE `FIPOP`.`medium` ADD `music_id` INT NULL AFTER `work_id`;
ALTER TABLE `FIPOP`.`medium` ADD CONSTRAINT `fk_medium_music1` FOREIGN KEY (`music_id`) REFERENCES `music`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;
CREATE INDEX `fk_medium_music1_idx` ON `FIPOP`.`medium` (`music_id` ASC);

ALTER TABLE `FIPOP`.`music` DROP INDEX `fk_music_medium1_idx`;
ALTER TABLE `FIPOP`.`music` DROP FOREIGN KEY `fk_music_medium1`;
ALTER TABLE `FIPOP`.`music` DROP `primary_source_medium_id`;


-- -----------------------------------------------------
-- Table `FIPOP`.`music_form_element_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_form_element_type` (
  `id` INT NOT NULL,
  `color_hex` VARCHAR(6) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FIPOP`.`music_form_element_type_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_form_element_type_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `music_form_element_type_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_music_form_element_type_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_form_element_type_translation_music_form_element_type1`
    FOREIGN KEY (`music_form_element_type_id`)
    REFERENCES `FIPOP`.`music_form_element_type` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_form_element_type_translation_language1_idx` ON `FIPOP`.`music_form_element_type_translation` (`language_id` ASC);

CREATE INDEX `fk_music_form_element_type_translation_music_form_element_t_idx` ON `FIPOP`.`music_form_element_type_translation` (`music_form_element_type_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`music_form_element`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_form_element` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `music_id` INT NOT NULL,
  `music_form_element_type_id` INT NOT NULL,
  `start_time` INT(11) NOT NULL,
  `end_time` INT(11) NOT NULL,
  `repeat_last_row` TINYINT(1) NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_music_form_element_music1`
    FOREIGN KEY (`music_id`)
    REFERENCES `FIPOP`.`music` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_form_element_music_form_element_type1`
    FOREIGN KEY (`music_form_element_type_id`)
    REFERENCES `FIPOP`.`music_form_element_type` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_form_element_music1_idx` ON `FIPOP`.`music_form_element` (`music_id` ASC);

CREATE INDEX `fk_music_form_element_music_form_element_type1_idx` ON `FIPOP`.`music_form_element` (`music_form_element_type_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`music_form_element_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_form_element_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `music_form_element_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `text` TEXT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_music_form_element_translation_music_form_element1`
    FOREIGN KEY (`music_form_element_id`)
    REFERENCES `FIPOP`.`music_form_element` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_form_element_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_form_element_translation_music_form_element1_idx` ON `FIPOP`.`music_form_element_translation` (`music_form_element_id` ASC);

CREATE INDEX `fk_music_form_element_translation_language1_idx` ON `FIPOP`.`music_form_element_translation` (`language_id` ASC);

-- -----------------------------------------------------
-- Data for table `FIPOP`.`music_form_element_type`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`music_form_element_type` (`id`, `color_hex`) VALUES (1, '5c85d6');
INSERT INTO `FIPOP`.`music_form_element_type` (`id`, `color_hex`) VALUES (2, 'e6e600');
INSERT INTO `FIPOP`.`music_form_element_type` (`id`, `color_hex`) VALUES (3, '39ac39');
INSERT INTO `FIPOP`.`music_form_element_type` (`id`, `color_hex`) VALUES (4, '5c85d6');
INSERT INTO `FIPOP`.`music_form_element_type` (`id`, `color_hex`) VALUES (5, '5c85d6');
INSERT INTO `FIPOP`.`music_form_element_type` (`id`, `color_hex`) VALUES (6, '5c85d6');
INSERT INTO `FIPOP`.`music_form_element_type` (`id`, `color_hex`) VALUES (7, '800000');
INSERT INTO `FIPOP`.`music_form_element_type` (`id`, `color_hex`) VALUES (8, 'a6a6a6');

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`music_form_element_type_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (1, 1, 1, 'Intro');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (2, 2, 1, 'Verse');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (3, 3, 1, 'Chorus');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (4, 4, 1, 'Outro');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (5, 5, 1, 'Bridge');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (6, 6, 1, 'Interlude');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (7, 7, 1, 'Instr. Solo');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (8, 8, 1, 'Tacet');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (9, 1, 2, 'Intro');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (10, 2, 2, 'Verse');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (11, 3, 2, 'Chorus');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (12, 4, 2, 'Outro');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (13, 5, 2, 'Bridge');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (14, 6, 2, 'Interlude');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (15, 7, 2, 'Instr. Solo');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (16, 8, 2, 'Tacet');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (17, 1, 3, 'Intro');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (18, 2, 3, 'Strophe');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (19, 3, 3, 'Refrain');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (20, 4, 3, 'Outro');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (21, 5, 3, 'Bridge');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (22, 6, 3, 'Interlude');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (23, 7, 3, 'Instr. Solo');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (24, 8, 3, 'Tacet');

COMMIT;

