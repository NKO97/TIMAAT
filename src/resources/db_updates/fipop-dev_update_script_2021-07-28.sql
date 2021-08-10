-- -----------------------------------------------------
-- Table `FIPOP`.`permission_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`permission_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


DROP TABLE IF EXISTS `FIPOP`.`user_account_has_category_set`;
DROP TABLE IF EXISTS `FIPOP`.`user_account_has_media_collection`;
DROP TABLE IF EXISTS `FIPOP`.`user_account_has_media_collection_analysis_list`;
DROP TABLE IF EXISTS `FIPOP`.`user_account_has_medium_analysis_list`;
DROP TABLE IF EXISTS `FIPOP`.`user_account_has_work_analysis_list`;


-- -----------------------------------------------------
-- Table `FIPOP`.`user_account_has_category_set`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`user_account_has_category_set` (
  `user_account_id` INT NOT NULL,
  `category_set_id` INT NOT NULL,
  `permission_type_id` INT NOT NULL,
  PRIMARY KEY (`user_account_id`, `category_set_id`),
  CONSTRAINT `fk_user_account_has_category_set_user_account1`
    FOREIGN KEY (`user_account_id`)
    REFERENCES `FIPOP`.`user_account` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_account_has_category_set_category_set1`
    FOREIGN KEY (`category_set_id`)
    REFERENCES `FIPOP`.`category_set` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_account_has_category_set_permission_type1`
    FOREIGN KEY (`permission_type_id`)
    REFERENCES `FIPOP`.`permission_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_user_account_has_category_set_category_set1_idx` ON `FIPOP`.`user_account_has_category_set` (`category_set_id` ASC);

CREATE INDEX `fk_user_account_has_category_set_user_account1_idx` ON `FIPOP`.`user_account_has_category_set` (`user_account_id` ASC);

CREATE INDEX `fk_user_account_has_category_set_permission_type1_idx` ON `FIPOP`.`user_account_has_category_set` (`permission_type_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`user_account_has_media_collection`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`user_account_has_media_collection` (
  `user_account_id` INT NOT NULL,
  `media_collection_id` INT NOT NULL,
  `permission_type_id` INT NOT NULL,
  PRIMARY KEY (`user_account_id`, `media_collection_id`),
  CONSTRAINT `fk_user_account_has_media_collection_user_account1`
    FOREIGN KEY (`user_account_id`)
    REFERENCES `FIPOP`.`user_account` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_account_has_media_collection_media_collection1`
    FOREIGN KEY (`media_collection_id`)
    REFERENCES `FIPOP`.`media_collection` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_account_has_media_collection_permission_type1`
    FOREIGN KEY (`permission_type_id`)
    REFERENCES `FIPOP`.`permission_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_user_account_has_media_collection_media_collection1_idx` ON `FIPOP`.`user_account_has_media_collection` (`media_collection_id` ASC);

CREATE INDEX `fk_user_account_has_media_collection_user_account1_idx` ON `FIPOP`.`user_account_has_media_collection` (`user_account_id` ASC);

CREATE INDEX `fk_user_account_has_media_collection_permission_type1_idx` ON `FIPOP`.`user_account_has_media_collection` (`permission_type_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`user_account_has_media_collection_analysis_list`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`user_account_has_media_collection_analysis_list` (
  `user_account_id` INT NOT NULL,
  `media_collection_analysis_list_id` INT NOT NULL,
  `permission_type_id` INT NOT NULL,
  PRIMARY KEY (`user_account_id`, `media_collection_analysis_list_id`),
  CONSTRAINT `fk_user_account_has_media_collection_analysis_list_user_accoun1`
    FOREIGN KEY (`user_account_id`)
    REFERENCES `FIPOP`.`user_account` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_account_has_media_collection_analysis_list_media_colle1`
    FOREIGN KEY (`media_collection_analysis_list_id`)
    REFERENCES `FIPOP`.`media_collection_analysis_list` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_account_has_media_collection_analysis_list_permission1`
    FOREIGN KEY (`permission_type_id`)
    REFERENCES `FIPOP`.`permission_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_user_account_has_media_collection_analysis_list_media_c1_idx` ON `FIPOP`.`user_account_has_media_collection_analysis_list` (`media_collection_analysis_list_id` ASC);

CREATE INDEX `fk_user_account_has_media_collection_analysis_list_user_ac1_idx` ON `FIPOP`.`user_account_has_media_collection_analysis_list` (`user_account_id` ASC);

CREATE INDEX `fk_user_account_has_media_collection_analysis_list_permissi_idx` ON `FIPOP`.`user_account_has_media_collection_analysis_list` (`permission_type_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`user_account_has_medium_analysis_list`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`user_account_has_medium_analysis_list` (
  `user_account_id` INT NOT NULL,
  `medium_analysis_list_id` INT NOT NULL,
  `permission_type_id` INT NOT NULL,
  PRIMARY KEY (`user_account_id`, `medium_analysis_list_id`),
  CONSTRAINT `fk_user_account_has_medium_analysis_list_user_account1`
    FOREIGN KEY (`user_account_id`)
    REFERENCES `FIPOP`.`user_account` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_account_has_medium_analysis_list_medium_analysis_list1`
    FOREIGN KEY (`medium_analysis_list_id`)
    REFERENCES `FIPOP`.`medium_analysis_list` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_account_has_medium_analysis_list_permission_type1`
    FOREIGN KEY (`permission_type_id`)
    REFERENCES `FIPOP`.`permission_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_user_account_has_medium_analysis_list_medium_analysis_li1_idx` ON `FIPOP`.`user_account_has_medium_analysis_list` (`medium_analysis_list_id` ASC);

CREATE INDEX `fk_user_account_has_medium_analysis_list_user_account1_idx` ON `FIPOP`.`user_account_has_medium_analysis_list` (`user_account_id` ASC);

CREATE INDEX `fk_user_account_has_medium_analysis_list_permission_type1_idx` ON `FIPOP`.`user_account_has_medium_analysis_list` (`permission_type_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`user_account_has_work_analysis_list`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`user_account_has_work_analysis_list` (
  `user_account_id` INT NOT NULL,
  `work_analysis_list_id` INT NOT NULL,
  `permission_type_id` INT NOT NULL,
  PRIMARY KEY (`user_account_id`, `work_analysis_list_id`),
  CONSTRAINT `fk_user_account_has_work_analysis_list_user_account1`
    FOREIGN KEY (`user_account_id`)
    REFERENCES `FIPOP`.`user_account` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_account_has_work_analysis_list_work_analysis_list1`
    FOREIGN KEY (`work_analysis_list_id`)
    REFERENCES `FIPOP`.`work_analysis_list` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_account_has_work_analysis_list_permission_type1`
    FOREIGN KEY (`permission_type_id`)
    REFERENCES `FIPOP`.`permission_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_user_account_has_work_analysis_list_work_analysis_list_idx` ON `FIPOP`.`user_account_has_work_analysis_list` (`work_analysis_list_id` ASC);

CREATE INDEX `fk_user_account_has_work_analysis_list_user_account1_idx` ON `FIPOP`.`user_account_has_work_analysis_list` (`user_account_id` ASC);

CREATE INDEX `fk_user_account_has_work_analysis_list_permission_type1_idx` ON `FIPOP`.`user_account_has_work_analysis_list` (`permission_type_id` ASC);


-- -----------------------------------------------------
-- Data for table `FIPOP`.`permission_type`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`permission_type` (`id`, `type`) VALUES (1, 'read');
INSERT INTO `FIPOP`.`permission_type` (`id`, `type`) VALUES (2, 'write');
INSERT INTO `FIPOP`.`permission_type` (`id`, `type`) VALUES (3, 'moderate');
INSERT INTO `FIPOP`.`permission_type` (`id`, `type`) VALUES (4, 'administrate');

COMMIT;
