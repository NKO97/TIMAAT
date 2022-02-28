ALTER TABLE `FIPOP`.`music` DROP INDEX `fk_music_articulation1_idx`;
ALTER TABLE `FIPOP`.`music` DROP FOREIGN KEY `fk_music_articulation1`;
ALTER TABLE `FIPOP`.`music` DROP `articulation_id`;

ALTER TABLE `FIPOP`.`music` DROP INDEX `fk_music_text_setting1_idx`;
ALTER TABLE `FIPOP`.`music` DROP FOREIGN KEY `fk_music_text_setting1`;
ALTER TABLE `FIPOP`.`music` DROP `text_setting_id`;

DROP TABLE `fipop`.`text_setting_translation`;
DROP TABLE `fipop`.`text_setting`;

-- -----------------------------------------------------
-- Table `FIPOP`.`music_articulation_element`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_articulation_element` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `music_id` INT NOT NULL,
  `articulation_id` INT NOT NULL,
  `start_time` INT(11) NOT NULL,
  `end_time` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_music_articulation_element_music1`
    FOREIGN KEY (`music_id`)
    REFERENCES `FIPOP`.`music` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_articulation_element_articulation1`
    FOREIGN KEY (`articulation_id`)
    REFERENCES `FIPOP`.`articulation` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_articulation_element_music1_idx` ON `FIPOP`.`music_articulation_element` (`music_id` ASC);

CREATE INDEX `fk_music_articulation_element_articulation1_idx` ON `FIPOP`.`music_articulation_element` (`articulation_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`music_text_setting_element_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_text_setting_element_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FIPOP`.`music_text_setting_element`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_text_setting_element` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `music_id` INT NOT NULL,
  `music_text_setting_element_type_id` INT NOT NULL,
  `start_time` INT(11) NOT NULL,
  `end_time` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_music_text_setting_element_music1`
    FOREIGN KEY (`music_id`)
    REFERENCES `FIPOP`.`music` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_text_setting_element_music_text_setting_element_type1`
    FOREIGN KEY (`music_text_setting_element_type_id`)
    REFERENCES `FIPOP`.`music_text_setting_element_type` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_text_setting_element_music1_idx` ON `FIPOP`.`music_text_setting_element` (`music_id` ASC);

CREATE INDEX `fk_music_text_setting_element_music_text_setting_element_ty_idx` ON `FIPOP`.`music_text_setting_element` (`music_text_setting_element_type_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`music_text_setting_element_type_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_text_setting_element_type_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `music_text_setting_element_type_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_music_text_setting_element_type_translation_music_text_set1`
    FOREIGN KEY (`music_text_setting_element_type_id`)
    REFERENCES `FIPOP`.`music_text_setting_element_type` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_text_setting_element_type_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_text_setting_element_type_translation_music_text_s_idx` ON `FIPOP`.`music_text_setting_element_type_translation` (`music_text_setting_element_type_id` ASC);

CREATE INDEX `fk_music_text_setting_element_type_translation_language1_idx` ON `FIPOP`.`music_text_setting_element_type_translation` (`language_id` ASC);


-- -----------------------------------------------------
-- Data for table `FIPOP`.`music_text_setting_element_type`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`music_text_setting_element_type` (`id`) VALUES (1);
INSERT INTO `FIPOP`.`music_text_setting_element_type` (`id`) VALUES (2);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`music_text_setting_element_type_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`music_text_setting_element_type_translation` (`id`, `music_text_setting_element_type_id`, `language_id`, `type`) VALUES (1, 1, 1, 'melismatic');
INSERT INTO `FIPOP`.`music_text_setting_element_type_translation` (`id`, `music_text_setting_element_type_id`, `language_id`, `type`) VALUES (2, 2, 1, 'syllabic');
INSERT INTO `FIPOP`.`music_text_setting_element_type_translation` (`id`, `music_text_setting_element_type_id`, `language_id`, `type`) VALUES (3, 1, 2, 'melismatic');
INSERT INTO `FIPOP`.`music_text_setting_element_type_translation` (`id`, `music_text_setting_element_type_id`, `language_id`, `type`) VALUES (4, 2, 2, 'syllabic');
INSERT INTO `FIPOP`.`music_text_setting_element_type_translation` (`id`, `music_text_setting_element_type_id`, `language_id`, `type`) VALUES (5, 1, 3, 'melismatisch');
INSERT INTO `FIPOP`.`music_text_setting_element_type_translation` (`id`, `music_text_setting_element_type_id`, `language_id`, `type`) VALUES (6, 2, 3, 'syllabisch');

COMMIT;