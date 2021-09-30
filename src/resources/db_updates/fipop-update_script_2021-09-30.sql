ALTER TABLE `fipop`.`user_password_old_hash` DROP FOREIGN KEY `fk_user_password_old_hash_user_password1`;
ALTER TABLE `fipop`.`user_password_old_hash` DROP INDEX `fk_user_password_old_hash_user_password1_idx`;
ALTER TABLE `fipop`.`user_password_old_hash` CHANGE `user_password_id` `user_account_id` INT(11) NOT NULL;
ALTER TABLE `fipop`.`user_password_old_hash` ADD CONSTRAINT `fk_user_password_old_hash_user_account1` FOREIGN KEY (`user_account_id`) REFERENCES `user_account`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX `fk_user_password_old_hash_user_account1_idx` ON `FIPOP`.`user_password_old_hash` (`user_account_id` ASC);

ALTER TABLE `fipop`.`user_password_old_hash` ADD `user_password_hash_type_id` INT NOT NULL AFTER `user_account_id`;
ALTER TABLE `fipop`.`user_password_old_hash` ADD CONSTRAINT `fk_user_password_old_hash_user_password_hash_type1` FOREIGN KEY (`user_password_hash_type_id`) REFERENCES `FIPOP`.`user_password_hash_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX `fk_user_password_old_hash_user_password_hash_type1_idx` ON `FIPOP`.`user_password_old_hash` (`user_password_hash_type_id` ASC);

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

ALTER TABLE `FIPOP`.`media_collection` ADD `global_permission` TINYINT(2) NULL DEFAULT '0' AFTER `is_systemic`;
ALTER TABLE `FIPOP`.`medium_analysis_list` ADD `global_permission` TINYINT(2) NULL DEFAULT '0'AFTER `last_edited_by_user_account_id`;
ALTER TABLE `FIPOP`.`work_analysis_list` ADD `global_permission` TINYINT(2) NULL DEFAULT '0' AFTER `last_edited_by_user_account_id`;
ALTER TABLE `FIPOP`.`media_collection_analysis_list` ADD `global_permission` TINYINT(2) NULL DEFAULT '0' AFTER `last_edited_by_user_account_id`;

ALTER TABLE `FIPOP`.`media_collection` ADD `created_by_user_account_id` INT NOT NULL DEFAULT 1 AFTER `media_collection_type_id`;
ALTER TABLE `FIPOP`.`media_collection` ADD `last_edited_by_user_account_id` INT NULL AFTER `created_by_user_account_id`;
ALTER TABLE `FIPOP`.`media_collection` ADD `created_at` TIMESTAMP NOT NULL;
ALTER TABLE `FIPOP`.`media_collection` ADD `last_edited_at` TIMESTAMP NULL;
ALTER TABLE `FIPOP`.`media_collection` ADD CONSTRAINT `fk_media_collection_user_account1` FOREIGN KEY (`created_by_user_account_id`) REFERENCES `FIPOP`.`user_account` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`media_collection` ADD CONSTRAINT `fk_media_collection_user_account2` FOREIGN KEY (`last_edited_by_user_account_id`) REFERENCES `FIPOP`.`user_account` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

CREATE INDEX `fk_media_collection_user_account1_idx` ON `FIPOP`.`media_collection` (`created_by_user_account_id` ASC);

CREATE INDEX `fk_media_collection_user_account2_idx` ON `FIPOP`.`media_collection` (`last_edited_by_user_account_id` ASC);

ALTER TABLE `FIPOP`.`analysis_method_type` ADD `layer_visual` TINYINT(1) NULL;
ALTER TABLE `FIPOP`.`analysis_method_type` ADD `layer_audio` TINYINT(1) NULL;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`analysis_method_type`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '1' WHERE `analysis_method_type`.`id` = 1;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 7;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 8;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 9;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 10;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 11;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 12;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 13;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 14;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 15;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 16;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 17;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '1' WHERE `analysis_method_type`.`id` = 20;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '0', `layer_audio` = '1' WHERE `analysis_method_type`.`id` = 21;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '0', `layer_audio` = '1' WHERE `analysis_method_type`.`id` = 22;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '0', `layer_audio` = '1' WHERE `analysis_method_type`.`id` = 23;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '0', `layer_audio` = '1' WHERE `analysis_method_type`.`id` = 24;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 25;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 26;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 27;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 28;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 29;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 30;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 31;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 32;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 33;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 34;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 35;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 36;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 37;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 38;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 39;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 40;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 41;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 42;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 43;

COMMIT;

ALTER TABLE `FIPOP`.`annotation` DROP FOREIGN KEY `fk_annotation_iri1`;
ALTER TABLE `FIPOP`.`annotation` DROP FOREIGN KEY `fk_annotation_uuid1`;
ALTER TABLE `FIPOP`.`annotation` DROP INDEX `fk_annotation_uuid1_idx`;
ALTER TABLE `FIPOP`.`annotation` DROP INDEX `fk_annotation_iri1_idx`;

DROP TABLE `FIPOP`.`iri`;
DROP TABLE `FIPOP`.`uuid`;

ALTER TABLE `FIPOP`.`annotation` DROP `iri.id`;
ALTER TABLE `FIPOP`.`annotation` CHANGE `uuid_id` `uuid` VARCHAR(36) NULL DEFAULT NULL;
UPDATE `FIPOP`.`annotation` SET `uuid` = NULL;

ALTER TABLE `FIPOP`.`medium_analysis_list` ADD `uuid` VARCHAR(36) NULL DEFAULT NULL AFTER `medium_id`;

ALTER TABLE `FIPOP`.`publication` DROP FOREIGN KEY `fk_medium_id`;
ALTER TABLE `FIPOP`.`publication` DROP FOREIGN KEY `fk_media_collection_id1`;
ALTER TABLE `FIPOP`.`publication` DROP INDEX `fk_medium_id`;
ALTER TABLE `FIPOP`.`publication` DROP INDEX `fk_media_collection_id1`;
ALTER TABLE `FIPOP`.`publication` DROP `medium_id`;
ALTER TABLE `FIPOP`.`publication` DROP `media_collection_id`;

TRUNCATE TABLE `FIPOP`.`publication`;

ALTER TABLE `FIPOP`.`publication` ADD `media_collection_analysis_list_id` INT NULL AFTER `owner_user_account_id`;
ALTER TABLE `FIPOP`.`publication` ADD `medium_analysis_list_id` INT NULL AFTER `media_collection_analysis_list_id`;
ALTER TABLE `FIPOP`.`publication` ADD `work_analysis_list_id` INT NULL AFTER `medium_analysis_list_id`;

ALTER TABLE `FIPOP`.`publication` ADD CONSTRAINT `fk_publication_media_collection_analysis_list1` FOREIGN KEY (`media_collection_analysis_list_id`) REFERENCES `FIPOP`.`media_collection_analysis_list` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`publication` ADD CONSTRAINT `fk_publication_medium_analysis_list1` FOREIGN KEY (`medium_analysis_list_id`) REFERENCES `FIPOP`.`medium_analysis_list` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`publication` ADD CONSTRAINT `fk_publication_work_analysis_list1` FOREIGN KEY (`work_analysis_list_id`) REFERENCES `FIPOP`.`work_analysis_list` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

CREATE INDEX `fk_publication_media_collection_analysis_list1_idx` ON `FIPOP`.`publication` (`media_collection_analysis_list_id` ASC);
CREATE INDEX `fk_publication_medium_analysis_list1_idx` ON `FIPOP`.`publication` (`medium_analysis_list_id` ASC);
CREATE INDEX `fk_publication_work_analysis_list1_idx` ON `FIPOP`.`publication` (`work_analysis_list_id` ASC);
