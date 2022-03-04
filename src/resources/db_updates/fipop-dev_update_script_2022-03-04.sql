-- -----------------------------------------------------
-- Table `FIPOP`.`camera_depth_of_focus`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`camera_depth_of_focus` (
  `analysis_method_id` INT NOT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_camera_depth_of_focus_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FIPOP`.`camera_depth_of_focus_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`camera_depth_of_focus_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `camera_depth_of_focus_analysis_method_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_camera_depth_of_focus_translation_camera_depth_of_focus1`
    FOREIGN KEY (`camera_depth_of_focus_analysis_method_id`)
    REFERENCES `FIPOP`.`camera_depth_of_focus` (`analysis_method_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_camera_depth_of_focus_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX IF NOT EXISTS `fk_camera_depth_of_focus_translation_camera_depth_of_focus1_idx` ON `FIPOP`.`camera_depth_of_focus_translation` (`camera_depth_of_focus_analysis_method_id` ASC);

CREATE INDEX IF NOT EXISTS `fk_camera_depth_of_focus_translation_language1_idx` ON `FIPOP`.`camera_depth_of_focus_translation` (`language_id` ASC);

ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` ADD `camera_depth_of_focus_analysis_method_id` INT NULL AFTER `camera_elevation_analysis_method_id`;
ALTER TABLE `concept_camera_position_and_perspective` ADD CONSTRAINT `fk_concept_camera_position_and_perspective_camera_depth_of_fo1` FOREIGN KEY (`camera_depth_of_focus_analysis_method_id`) REFERENCES `camera_depth_of_focus`(`analysis_method_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX `fk_concept_camera_position_and_perspective_camera_depth_of__idx` ON `FIPOP`.`concept_camera_position_and_perspective` (`camera_depth_of_focus_analysis_method_id` ASC);


-- -----------------------------------------------------
-- Data for table `FIPOP`.`analysis_method_type`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`, `layer_visual`, `layer_audio`) VALUES (52, 1, 1, 0);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`analysis_method`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (305, 52);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (306, 52);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (307, 52);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`analysis_method_type_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `analysis_method_type_id`, `language_id`, `name`) VALUES (52, 52, 1, 'DepthOfFocus');

COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`camera_depth_of_focus`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`camera_depth_of_focus` (`analysis_method_id`) VALUES (305);
INSERT INTO `FIPOP`.`camera_depth_of_focus` (`analysis_method_id`) VALUES (306);
INSERT INTO `FIPOP`.`camera_depth_of_focus` (`analysis_method_id`) VALUES (307);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`camera_depth_of_focus_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`camera_depth_of_focus_translation` (`id`, `camera_depth_of_focus_analysis_method_id`, `language_id`, `type`) VALUES (1, 305, 1, 'Near');
INSERT INTO `FIPOP`.`camera_depth_of_focus_translation` (`id`, `camera_depth_of_focus_analysis_method_id`, `language_id`, `type`) VALUES (2, 306, 1, 'Medium');
INSERT INTO `FIPOP`.`camera_depth_of_focus_translation` (`id`, `camera_depth_of_focus_analysis_method_id`, `language_id`, `type`) VALUES (3, 307, 1, 'Far');
INSERT INTO `FIPOP`.`camera_depth_of_focus_translation` (`id`, `camera_depth_of_focus_analysis_method_id`, `language_id`, `type`) VALUES (4, 305, 2, 'Near');
INSERT INTO `FIPOP`.`camera_depth_of_focus_translation` (`id`, `camera_depth_of_focus_analysis_method_id`, `language_id`, `type`) VALUES (5, 306, 2, 'Medium');
INSERT INTO `FIPOP`.`camera_depth_of_focus_translation` (`id`, `camera_depth_of_focus_analysis_method_id`, `language_id`, `type`) VALUES (6, 307, 2, 'Far');
INSERT INTO `FIPOP`.`camera_depth_of_focus_translation` (`id`, `camera_depth_of_focus_analysis_method_id`, `language_id`, `type`) VALUES (7, 305, 3, 'Nah');
INSERT INTO `FIPOP`.`camera_depth_of_focus_translation` (`id`, `camera_depth_of_focus_analysis_method_id`, `language_id`, `type`) VALUES (8, 306, 3, 'Mittel');
INSERT INTO `FIPOP`.`camera_depth_of_focus_translation` (`id`, `camera_depth_of_focus_analysis_method_id`, `language_id`, `type`) VALUES (9, 307, 3, 'Weit');

COMMIT;