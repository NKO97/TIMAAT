-- -----------------------------------------------------
-- Table `FIPOP`.`jins`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`jins` (
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `FIPOP`.`jins_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`jins_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `jins_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_jins_translation_jins1`
    FOREIGN KEY (`jins_id`)
    REFERENCES `FIPOP`.`jins` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_jins_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
CREATE INDEX `fk_jins_translation_jins1_idx` ON `FIPOP`.`jins_translation` (`jins_id` ASC);
CREATE INDEX `fk_jins_translation_language1_idx` ON `FIPOP`.`jins_translation` (`language_id` ASC);

-- -----------------------------------------------------
-- Data for table `FIPOP`.`jins`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`jins` (`id`) VALUES (1);
INSERT INTO `FIPOP`.`jins` (`id`) VALUES (2);
INSERT INTO `FIPOP`.`jins` (`id`) VALUES (3);
INSERT INTO `FIPOP`.`jins` (`id`) VALUES (4);
INSERT INTO `FIPOP`.`jins` (`id`) VALUES (5);
INSERT INTO `FIPOP`.`jins` (`id`) VALUES (6);
INSERT INTO `FIPOP`.`jins` (`id`) VALUES (7);
INSERT INTO `FIPOP`.`jins` (`id`) VALUES (8);
INSERT INTO `FIPOP`.`jins` (`id`) VALUES (9);
INSERT INTO `FIPOP`.`jins` (`id`) VALUES (10);
INSERT INTO `FIPOP`.`jins` (`id`) VALUES (11);
INSERT INTO `FIPOP`.`jins` (`id`) VALUES (12);
INSERT INTO `FIPOP`.`jins` (`id`) VALUES (13);
INSERT INTO `FIPOP`.`jins` (`id`) VALUES (14);
INSERT INTO `FIPOP`.`jins` (`id`) VALUES (15);
INSERT INTO `FIPOP`.`jins` (`id`) VALUES (16);
INSERT INTO `FIPOP`.`jins` (`id`) VALUES (17);
INSERT INTO `FIPOP`.`jins` (`id`) VALUES (18);
INSERT INTO `FIPOP`.`jins` (`id`) VALUES (19);
INSERT INTO `FIPOP`.`jins` (`id`) VALUES (20);
INSERT INTO `FIPOP`.`jins` (`id`) VALUES (21);
INSERT INTO `FIPOP`.`jins` (`id`) VALUES (22);
INSERT INTO `FIPOP`.`jins` (`id`) VALUES (23);
INSERT INTO `FIPOP`.`jins` (`id`) VALUES (24);
COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`jins_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`jins_translation` (`id`, `jins_id`, `language_id`, `type`) VALUES (1, 1, 1, '‘Ajam');
INSERT INTO `FIPOP`.`jins_translation` (`id`, `jins_id`, `language_id`, `type`) VALUES (2, 2, 1, '‘Ajam Murassa‘');
INSERT INTO `FIPOP`.`jins_translation` (`id`, `jins_id`, `language_id`, `type`) VALUES (3, 3, 1, 'Athar Kurd');
INSERT INTO `FIPOP`.`jins_translation` (`id`, `jins_id`, `language_id`, `type`) VALUES (4, 4, 1, 'Bayati');
INSERT INTO `FIPOP`.`jins_translation` (`id`, `jins_id`, `language_id`, `type`) VALUES (5, 5, 1, 'Hijaz');
INSERT INTO `FIPOP`.`jins_translation` (`id`, `jins_id`, `language_id`, `type`) VALUES (6, 6, 1, 'Hijaz Murassa‘');
INSERT INTO `FIPOP`.`jins_translation` (`id`, `jins_id`, `language_id`, `type`) VALUES (7, 7, 1, 'Hijazkar');
INSERT INTO `FIPOP`.`jins_translation` (`id`, `jins_id`, `language_id`, `type`) VALUES (8, 8, 1, 'Jiharkah');
INSERT INTO `FIPOP`.`jins_translation` (`id`, `jins_id`, `language_id`, `type`) VALUES (9, 9, 1, 'Kurd');
INSERT INTO `FIPOP`.`jins_translation` (`id`, `jins_id`, `language_id`, `type`) VALUES (10, 10, 1, 'Lami');
INSERT INTO `FIPOP`.`jins_translation` (`id`, `jins_id`, `language_id`, `type`) VALUES (11, 11, 1, 'Mukhalif Sharqi');
INSERT INTO `FIPOP`.`jins_translation` (`id`, `jins_id`, `language_id`, `type`) VALUES (12, 12, 1, 'Musta‘ar');
INSERT INTO `FIPOP`.`jins_translation` (`id`, `jins_id`, `language_id`, `type`) VALUES (13, 13, 1, 'Nahawand');
INSERT INTO `FIPOP`.`jins_translation` (`id`, `jins_id`, `language_id`, `type`) VALUES (14, 14, 1, 'Nahawand Murassa‘');
INSERT INTO `FIPOP`.`jins_translation` (`id`, `jins_id`, `language_id`, `type`) VALUES (15, 15, 1, 'Nikriz');
INSERT INTO `FIPOP`.`jins_translation` (`id`, `jins_id`, `language_id`, `type`) VALUES (16, 16, 1, 'Rast');
INSERT INTO `FIPOP`.`jins_translation` (`id`, `jins_id`, `language_id`, `type`) VALUES (17, 17, 1, 'Saba');
INSERT INTO `FIPOP`.`jins_translation` (`id`, `jins_id`, `language_id`, `type`) VALUES (18, 18, 1, 'Saba Dalanshin');
INSERT INTO `FIPOP`.`jins_translation` (`id`, `jins_id`, `language_id`, `type`) VALUES (19, 19, 1, 'Saba Zamzam');
INSERT INTO `FIPOP`.`jins_translation` (`id`, `jins_id`, `language_id`, `type`) VALUES (20, 20, 1, 'Sazkar');
INSERT INTO `FIPOP`.`jins_translation` (`id`, `jins_id`, `language_id`, `type`) VALUES (21, 21, 1, 'Sikah');
INSERT INTO `FIPOP`.`jins_translation` (`id`, `jins_id`, `language_id`, `type`) VALUES (22, 22, 1, 'Sikah Baladi');
INSERT INTO `FIPOP`.`jins_translation` (`id`, `jins_id`, `language_id`, `type`) VALUES (23, 23, 1, 'Upper ‘Ajam');
INSERT INTO `FIPOP`.`jins_translation` (`id`, `jins_id`, `language_id`, `type`) VALUES (24, 24, 1, 'Upper Rast');
COMMIT;

-- -----------------------------------------------------
-- Table `FIPOP`.`maqam_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`maqam_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `FIPOP`.`maqam_subtype`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`maqam_subtype` (
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `FIPOP`.`maqam`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`maqam` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `maqam_type_id` INT NOT NULL,
  `maqam_subtype_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_maqam_maqam_type1`
    FOREIGN KEY (`maqam_type_id`)
    REFERENCES `FIPOP`.`maqam_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_maqam_maqam_subtype1`
    FOREIGN KEY (`maqam_subtype_id`)
    REFERENCES `FIPOP`.`maqam_subtype` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
CREATE INDEX `fk_maqam_maqam_type1_idx` ON `FIPOP`.`maqam` (`maqam_type_id` ASC);
CREATE INDEX `fk_maqam_maqam_subtype1_idx` ON `FIPOP`.`maqam` (`maqam_subtype_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`maqam_subtype_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`maqam_subtype_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `maqam_subtype_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `subtype` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_maqam_subtype_translation_maqam_subtype1`
    FOREIGN KEY (`maqam_subtype_id`)
    REFERENCES `FIPOP`.`maqam_subtype` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_maqam_subtype_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
CREATE INDEX `fk_maqam_subtype_translation_maqam_subtype1_idx` ON `FIPOP`.`maqam_subtype_translation` (`maqam_subtype_id` ASC);
CREATE INDEX `fk_maqam_subtype_translation_language1_idx` ON `FIPOP`.`maqam_subtype_translation` (`language_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`maqam_type_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`maqam_type_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `maqam_type_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `type` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_maqam_type_translation_maqam_type1`
    FOREIGN KEY (`maqam_type_id`)
    REFERENCES `FIPOP`.`maqam_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_maqam_type_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
CREATE INDEX `fk_maqam_type_translation_maqam_type1_idx` ON `FIPOP`.`maqam_type_translation` (`maqam_type_id` ASC);
CREATE INDEX `fk_maqam_type_translation_language1_idx` ON `FIPOP`.`maqam_type_translation` (`language_id` ASC);

-- -----------------------------------------------------
-- Data for table `FIPOP`.`maqam_type`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`maqam_type` (`id`) VALUES (1);
INSERT INTO `FIPOP`.`maqam_type` (`id`) VALUES (2);
INSERT INTO `FIPOP`.`maqam_type` (`id`) VALUES (3);
INSERT INTO `FIPOP`.`maqam_type` (`id`) VALUES (4);
INSERT INTO `FIPOP`.`maqam_type` (`id`) VALUES (5);
INSERT INTO `FIPOP`.`maqam_type` (`id`) VALUES (6);
INSERT INTO `FIPOP`.`maqam_type` (`id`) VALUES (7);
INSERT INTO `FIPOP`.`maqam_type` (`id`) VALUES (8);
INSERT INTO `FIPOP`.`maqam_type` (`id`) VALUES (9);
COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`maqam_type_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`maqam_type_translation` (`id`, `language_id`, `maqam_type_id`, `type`) VALUES (1, 1, 1, 'Maqam ‘Ajam Family (Ausgangs-Jins: Jins ‘Ajam)');
INSERT INTO `FIPOP`.`maqam_type_translation` (`id`, `language_id`, `maqam_type_id`, `type`) VALUES (2, 2, 1, 'Maqam Bayati Family (Ausgangs-Jins: Jins Bayati)');
INSERT INTO `FIPOP`.`maqam_type_translation` (`id`, `language_id`, `maqam_type_id`, `type`) VALUES (3, 3, 1, 'Maqam Hijaz Family (Ausgangs-Jins: Jins Hijaz)');
INSERT INTO `FIPOP`.`maqam_type_translation` (`id`, `language_id`, `maqam_type_id`, `type`) VALUES (4, 4, 1, 'Maqam Kurd Family (Ausgangs-Jins: Jins Kurd)');
INSERT INTO `FIPOP`.`maqam_type_translation` (`id`, `language_id`, `maqam_type_id`, `type`) VALUES (5, 5, 1, 'Maqam Nahawand Family (Ausgangs-Jins: Jins Nahawand)');
INSERT INTO `FIPOP`.`maqam_type_translation` (`id`, `language_id`, `maqam_type_id`, `type`) VALUES (6, 6, 1, 'Maqam Nikriz Family (Ausgangs-Jins: Jins Nikriz)');
INSERT INTO `FIPOP`.`maqam_type_translation` (`id`, `language_id`, `maqam_type_id`, `type`) VALUES (7, 7, 1, 'Maqam Rast Family (Ausgangs-Jins: Jins Rast)');
INSERT INTO `FIPOP`.`maqam_type_translation` (`id`, `language_id`, `maqam_type_id`, `type`) VALUES (8, 8, 1, 'Maqam Sikah Family (Ausgangs-Jins: Jins Sikah)');
INSERT INTO `FIPOP`.`maqam_type_translation` (`id`, `language_id`, `maqam_type_id`, `type`) VALUES (9, 9, 1, 'No maqam family');
COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`maqam_subtype`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (1);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (2);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (3);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (4);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (5);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (6);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (7);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (8);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (9);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (10);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (11);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (12);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (13);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (14);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (15);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (16);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (17);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (18);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (19);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (20);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (21);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (22);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (23);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (24);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (25);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (26);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (27);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (28);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (29);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (30);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (31);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (32);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (33);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (34);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (35);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (36);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (37);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (38);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (39);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (40);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (41);
INSERT INTO `FIPOP`.`maqam_subtype` (`id`) VALUES (42);
COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`maqam_subtype_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (1, 1, 1, 'Maqam ‘Ajam');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (2, 2, 1, 'Maqam ‘Ajam ‘Ushayran');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (3, 3, 1, 'Maqam Shawq Afza');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (4, 4, 1, 'Maqam Bayati');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (5, 5, 1, 'Maqam Bayati Shuri');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (6, 6, 1, 'Maqam Husayni');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (7, 7, 1, 'Maqam Hijaz');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (8, 8, 1, 'Maqam Hijazkar');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (9, 9, 1, 'Maqam Shadd ‘Araban');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (10, 10, 1, 'Maqam Shahnaz');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (11, 11, 1, 'Maqam Suzidil');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (12, 12, 1, 'Maqam Zanjaran');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (13, 13, 1, 'Maqam Kurd');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (14, 14, 1, 'Maqam Hijazkar Kurd');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (15, 15, 1, 'Maqam Nahawand');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (16, 16, 1, 'Maqam Farahfaza');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (17, 17, 1, 'Maqam Nahawand Murassa‘');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (18, 18, 1, 'Maqam ‘Ushaq Masri');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (19, 19, 1, 'Maqam Nikriz');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (20, 20, 1, 'Maqam Nawa Athar');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (21, 21, 1, 'Maqam Athar Kurd');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (22, 22, 1, 'Maqam Rast');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (23, 23, 1, 'Maqam Kirdan');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (24, 24, 1, 'Maqam Sazkar');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (25, 25, 1, 'Maqam Suznak');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (26, 26, 1, 'Maqam Nairuz');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (27, 27, 1, 'Maqam Yakah');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (28, 28, 1, 'Maqam Dalanshin');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (29, 29, 1, 'Maqam Suzdalara');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (30, 30, 1, 'Maqam Mahur');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (31, 31, 1, 'Maqam Sikah');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (32, 32, 1, 'Maqam Huzam');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (33, 33, 1, 'Maqam Rahat al-Arwah');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (34, 34, 1, 'Maqam ‘Iraq');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (35, 35, 1, 'Maqam Awj ‘Iraq');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (36, 36, 1, 'Maqam Bastanikar');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (37, 37, 1, 'Maqam Musta‘ar');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (38, 38, 1, 'Maqam Jiharkah (Ausgangs-Jins: Jins Jiharkah)');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (39, 39, 1, 'Maqam Lami (Ausgangs-Jins: Jins Lami)');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (40, 40, 1, 'Maqam Saba (Ausgangs-Jins: Jins Saba)');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (41, 41, 1, 'Maqam Saba Zamzam (Ausgangs-Jins: Jins Saba Zamzam)');
INSERT INTO `FIPOP`.`maqam_subtype_translation` (`id`, `maqam_subtype_id`, `language_id`, `subtype`) VALUES (42, 42, 1, 'Maqam Sikah Baladi');

COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`maqam`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (1, 1, 1);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (2, 1, 2);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (3, 1, 3);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (4, 2, 4);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (5, 2, 5);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (6, 2, 6);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (7, 3, 7);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (8, 3, 8);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (9, 3, 9);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (10, 3, 10);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (11, 3, 11);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (12, 3, 12);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (13, 4, 13);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (14, 4, 14);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (15, 5, 15);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (16, 5, 16);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (17, 5, 17);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (18, 5, 18);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (19, 6, 19);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (20, 6, 20);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (21, 6, 21);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (22, 7, 22);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (23, 7, 23);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (24, 7, 24);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (25, 7, 25);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (26, 7, 26);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (27, 7, 27);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (28, 7, 28);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (29, 7, 29);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (30, 7, 30);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (31, 8, 31);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (32, 8, 32);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (33, 8, 33);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (34, 8, 34);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (35, 8, 35);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (36, 8, 36);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (37, 8, 37);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (38, 9, 38);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (39, 9, 39);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (40, 9, 40);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (41, 9, 41);
INSERT INTO `FIPOP`.`maqam` (`id`, `maqam_type_id`, `maqam_subtype_id`) VALUES (42, 9, 42);
COMMIT;

ALTER TABLE `FIPOP`.`ambience_subtype` DROP FOREIGN KEY `fk_ambience_subtype_ambience_type1`;
ALTER TABLE `FIPOP`.`ambience_subtype` DROP INDEX `fk_ambience_subtype_ambience_type1_idx`;
ALTER TABLE `FIPOP`.`noise_subtype` DROP FOREIGN KEY `fk_noise_subtype_noise_type1`;
ALTER TABLE `FIPOP`.`noise_subtype` DROP INDEX `fk_noise_subtype_noise_type1_idx`;
ALTER TABLE `FIPOP`.`sound_effect_subtype` DROP FOREIGN KEY `fk_sound_effect_subtype_sound_effect_type1`;
ALTER TABLE `FIPOP`.`sound_effect_subtype` DROP INDEX `fk_sound_effect_subtype_sound_effect_type1_idx`;

ALTER TABLE `FIPOP`.`analysis_music` ADD `maqam_id` INT NULL AFTER `articulation_id`;
ALTER TABLE `FIPOP`.`analysis_music` ADD CONSTRAINT `fk_analysis_music_maqam1` FOREIGN KEY (`maqam_id`) REFERENCES `FIPOP`.`maqam` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`analysis_music` ADD `jins_id` INT NULL AFTER `maqam_id`;
ALTER TABLE `FIPOP`.`analysis_music` ADD CONSTRAINT `fk_analysis_music_jins1` FOREIGN KEY (`jins_id`) REFERENCES `FIPOP`.`jins` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX `fk_analysis_music_maqam1_idx` ON `FIPOP`.`analysis_music` (`maqam_id` ASC);
CREATE INDEX `fk_analysis_music_jins1_idx` ON `FIPOP`.`analysis_music` (`jins_id` ASC);

ALTER TABLE `FIPOP`.`change_in_tempo_translation` CHANGE IF EXISTS `decription` `description` VARCHAR(512) NULL;