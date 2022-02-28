ALTER TABLE `FIPOP`.`music` ADD `music_text_setting_element_type_id` INT NULL AFTER `tempo_marking_id`;
ALTER TABLE `FIPOP`.`music` ADD CONSTRAINT `fk_music_music_text_setting_element_type1` FOREIGN KEY (`music_text_setting_element_type_id`) REFERENCES `music_text_setting_element_type`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX `fk_music_music_text_setting_element_type1_idx` ON `FIPOP`.`music` (`music_text_setting_element_type_id` ASC);

ALTER TABLE `FIPOP`.`music` DROP INDEX `fk_music_change_in_dynamics1_idx`;
ALTER TABLE `FIPOP`.`music` DROP FOREIGN KEY `fk_music_change_in_dynamics1`;
ALTER TABLE `FIPOP`.`music` DROP `change_in_dynamics_id`;


-- -----------------------------------------------------
-- Table `FIPOP`.`music_dynamics_element_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_dynamics_element_type` (
  `id` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FIPOP`.`music_dynamics_element`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_dynamics_element` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `music_id` INT NOT NULL,
  `music_dynamics_element_type_id` INT NOT NULL,
  `start_time` INT(11) NOT NULL,
  `end_time` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_music_dynamics_element_music1`
    FOREIGN KEY (`music_id`)
    REFERENCES `FIPOP`.`music` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_dynamics_element_music_dynamics_element_type1`
    FOREIGN KEY (`music_dynamics_element_type_id`)
    REFERENCES `FIPOP`.`music_dynamics_element_type` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_dynamics_element_music1_idx` ON `FIPOP`.`music_dynamics_element` (`music_id` ASC);

CREATE INDEX `fk_music_dynamics_element_music_dynamics_element_type1_idx` ON `FIPOP`.`music_dynamics_element` (`music_dynamics_element_type_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`music_dynamics_element_type_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_dynamics_element_type_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `music_dynamics_element_type_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_music_dynamics_element_type_translation_music_dynamics_ele1`
    FOREIGN KEY (`music_dynamics_element_type_id`)
    REFERENCES `FIPOP`.`music_dynamics_element_type` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_dynamics_element_type_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_dynamics_element_type_translation_music_dynamics_e_idx` ON `FIPOP`.`music_dynamics_element_type_translation` (`music_dynamics_element_type_id` ASC);

CREATE INDEX `fk_music_dynamics_element_type_translation_language1_idx` ON `FIPOP`.`music_dynamics_element_type_translation` (`language_id` ASC);


-- -----------------------------------------------------
-- Data for table `FIPOP`.`music_dynamics_element_type`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`music_dynamics_element_type` (`id`) VALUES (1);
INSERT INTO `FIPOP`.`music_dynamics_element_type` (`id`) VALUES (2);
INSERT INTO `FIPOP`.`music_dynamics_element_type` (`id`) VALUES (3);
INSERT INTO `FIPOP`.`music_dynamics_element_type` (`id`) VALUES (4);
INSERT INTO `FIPOP`.`music_dynamics_element_type` (`id`) VALUES (5);
INSERT INTO `FIPOP`.`music_dynamics_element_type` (`id`) VALUES (6);
INSERT INTO `FIPOP`.`music_dynamics_element_type` (`id`) VALUES (7);
INSERT INTO `FIPOP`.`music_dynamics_element_type` (`id`) VALUES (8);
INSERT INTO `FIPOP`.`music_dynamics_element_type` (`id`) VALUES (9);
INSERT INTO `FIPOP`.`music_dynamics_element_type` (`id`) VALUES (10);
INSERT INTO `FIPOP`.`music_dynamics_element_type` (`id`) VALUES (11);
INSERT INTO `FIPOP`.`music_dynamics_element_type` (`id`) VALUES (12);
INSERT INTO `FIPOP`.`music_dynamics_element_type` (`id`) VALUES (13);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`music_dynamics_element_type_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`music_dynamics_element_type_translation` (`id`, `music_dynamics_element_type_id`, `language_id`, `type`) VALUES (1, 1, 1, 'fortississimo');
INSERT INTO `FIPOP`.`music_dynamics_element_type_translation` (`id`, `music_dynamics_element_type_id`, `language_id`, `type`) VALUES (2, 2, 1, 'fortissimo');
INSERT INTO `FIPOP`.`music_dynamics_element_type_translation` (`id`, `music_dynamics_element_type_id`, `language_id`, `type`) VALUES (3, 3, 1, 'forte');
INSERT INTO `FIPOP`.`music_dynamics_element_type_translation` (`id`, `music_dynamics_element_type_id`, `language_id`, `type`) VALUES (4, 4, 1, 'mezzo-forte');
INSERT INTO `FIPOP`.`music_dynamics_element_type_translation` (`id`, `music_dynamics_element_type_id`, `language_id`, `type`) VALUES (5, 5, 1, 'mezzo-piano');
INSERT INTO `FIPOP`.`music_dynamics_element_type_translation` (`id`, `music_dynamics_element_type_id`, `language_id`, `type`) VALUES (6, 6, 1, 'piano');
INSERT INTO `FIPOP`.`music_dynamics_element_type_translation` (`id`, `music_dynamics_element_type_id`, `language_id`, `type`) VALUES (7, 7, 1, 'panissimo');
INSERT INTO `FIPOP`.`music_dynamics_element_type_translation` (`id`, `music_dynamics_element_type_id`, `language_id`, `type`) VALUES (8, 8, 1, 'pianississimo');
INSERT INTO `FIPOP`.`music_dynamics_element_type_translation` (`id`, `music_dynamics_element_type_id`, `language_id`, `type`) VALUES (9, 9, 1, 'crescendo');
INSERT INTO `FIPOP`.`music_dynamics_element_type_translation` (`id`, `music_dynamics_element_type_id`, `language_id`, `type`) VALUES (10, 10, 1, 'decrescendo');
INSERT INTO `FIPOP`.`music_dynamics_element_type_translation` (`id`, `music_dynamics_element_type_id`, `language_id`, `type`) VALUES (11, 11, 1, 'diminuendo');
INSERT INTO `FIPOP`.`music_dynamics_element_type_translation` (`id`, `music_dynamics_element_type_id`, `language_id`, `type`) VALUES (12, 12, 1, 'sforzando');
INSERT INTO `FIPOP`.`music_dynamics_element_type_translation` (`id`, `music_dynamics_element_type_id`, `language_id`, `type`) VALUES (13, 13, 1, 'fortepiano');

COMMIT;