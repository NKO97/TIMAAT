-- -----------------------------------------------------
-- Table `FIPOP`.`lighting`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`lighting` (
  `analysis_method_id` INT NOT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_lighting_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `FIPOP`.`lighting_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`lighting_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `lighting_analysis_method_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_lighting_translation_lighting1`
    FOREIGN KEY (`lighting_analysis_method_id`)
    REFERENCES `FIPOP`.`lighting` (`analysis_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_lighting_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
CREATE INDEX `fk_lighting_translation_lighting1_idx` ON `FIPOP`.`lighting_translation` (`lighting_analysis_method_id` ASC);
CREATE INDEX `fk_lighting_translation_language1_idx` ON `FIPOP`.`lighting_translation` (`language_id` ASC);

-- -----------------------------------------------------
-- Data for table `FIPOP`.`analysis_method_type`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (25, 1);
COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`analysis_method_type_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (25, 1, 25, 'Lighting');
COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`analysis_method`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (69, 25);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (70, 25);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (71, 25);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (72, 25);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (73, 25);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (74, 25);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (75, 25);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (76, 25);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (77, 25);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (78, 25);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (79, 25);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (80, 25);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (81, 25);

COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`lighting`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`lighting` (`analysis_method_id`) VALUES (69);
INSERT INTO `FIPOP`.`lighting` (`analysis_method_id`) VALUES (70);
INSERT INTO `FIPOP`.`lighting` (`analysis_method_id`) VALUES (71);
INSERT INTO `FIPOP`.`lighting` (`analysis_method_id`) VALUES (72);
INSERT INTO `FIPOP`.`lighting` (`analysis_method_id`) VALUES (73);
INSERT INTO `FIPOP`.`lighting` (`analysis_method_id`) VALUES (74);
INSERT INTO `FIPOP`.`lighting` (`analysis_method_id`) VALUES (75);
INSERT INTO `FIPOP`.`lighting` (`analysis_method_id`) VALUES (76);
INSERT INTO `FIPOP`.`lighting` (`analysis_method_id`) VALUES (77);
INSERT INTO `FIPOP`.`lighting` (`analysis_method_id`) VALUES (78);
INSERT INTO `FIPOP`.`lighting` (`analysis_method_id`) VALUES (79);
INSERT INTO `FIPOP`.`lighting` (`analysis_method_id`) VALUES (80);
INSERT INTO `FIPOP`.`lighting` (`analysis_method_id`) VALUES (81);
COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`lighting_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`lighting_translation` (`id`, `lighting_analysis_method_id`, `language_id`, `name`) VALUES (1, 69, 1, 'Natural Lighting');
INSERT INTO `FIPOP`.`lighting_translation` (`id`, `lighting_analysis_method_id`, `language_id`, `name`) VALUES (2, 70, 1, 'Key Lighting (Hauptausleuchtung des Bildobjekts / der Person)');
INSERT INTO `FIPOP`.`lighting_translation` (`id`, `lighting_analysis_method_id`, `language_id`, `name`) VALUES (3, 71, 1, 'High Key Lighting (helle Töne dominant)');
INSERT INTO `FIPOP`.`lighting_translation` (`id`, `lighting_analysis_method_id`, `language_id`, `name`) VALUES (4, 72, 1, 'Low Key Lighting (dunkle Töne dominieren)');
INSERT INTO `FIPOP`.`lighting_translation` (`id`, `lighting_analysis_method_id`, `language_id`, `name`) VALUES (5, 73, 1, 'Fill Lighting (löscht Schatten, die vom Key Light verursacht werden)');
INSERT INTO `FIPOP`.`lighting_translation` (`id`, `lighting_analysis_method_id`, `language_id`, `name`) VALUES (6, 74, 1, 'Back Lighting (Lichtquelle hinter Bildobjekt)');
INSERT INTO `FIPOP`.`lighting_translation` (`id`, `lighting_analysis_method_id`, `language_id`, `name`) VALUES (7, 75, 1, 'Practical Lighting (Lichtquellen im Bild; unterstützt den Raumeindruck)');
INSERT INTO `FIPOP`.`lighting_translation` (`id`, `lighting_analysis_method_id`, `language_id`, `name`) VALUES (8, 76, 1, 'Hard /Spot Lighting (\"Glanzlicht\"; konzentriert, scharfe Schattenkonturen)');
INSERT INTO `FIPOP`.`lighting_translation` (`id`, `lighting_analysis_method_id`, `language_id`, `name`) VALUES (9, 77, 1, 'Soft Lighting (diffus, weiche Schattenkonturen)');
INSERT INTO `FIPOP`.`lighting_translation` (`id`, `lighting_analysis_method_id`, `language_id`, `name`) VALUES (10, 78, 1, 'Bounce Lighting (flächiges Licht)');
INSERT INTO `FIPOP`.`lighting_translation` (`id`, `lighting_analysis_method_id`, `language_id`, `name`) VALUES (11, 79, 1, 'Chiaoscuro / Side Lighting (starke Hell-Dunkel-Kontraste im Bild)');
INSERT INTO `FIPOP`.`lighting_translation` (`id`, `lighting_analysis_method_id`, `language_id`, `name`) VALUES (12, 80, 1, 'Motivated Lighting (immitiert natürliches Licht)');
INSERT INTO `FIPOP`.`lighting_translation` (`id`, `lighting_analysis_method_id`, `language_id`, `name`) VALUES (13, 81, 1, 'Ambient Lighting (schafft eine atmosphärische Raumausleuchtung)');
COMMIT;