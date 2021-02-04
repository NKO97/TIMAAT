ALTER TABLE `FIPOP`.`medium_has_title` DROP FOREIGN KEY `fk_medium_has_title_title1`;
ALTER TABLE `FIPOP`.`medium_has_title` ADD CONSTRAINT `fk_medium_has_title_title1` FOREIGN KEY (`title_id`) REFERENCES `FIPOP`.`title` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `medium_has_category` DROP FOREIGN KEY `fk_medium_has_category_category1`; 
ALTER TABLE `medium_has_category` ADD CONSTRAINT `fk_medium_has_category_category1` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION; ALTER TABLE `medium_has_category` DROP FOREIGN KEY `fk_medium_has_category_medium1`; ALTER TABLE `medium_has_category` ADD CONSTRAINT `fk_medium_has_category_medium1` FOREIGN KEY (`medium_id`) REFERENCES `medium`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- -----------------------------------------------------
-- Table `FIPOP`.`medium_has_category_set`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`medium_has_category_set` (
  `medium_id` INT NOT NULL,
  `category_set_id` INT NOT NULL,
  PRIMARY KEY (`medium_id`, `category_set_id`),
  CONSTRAINT `fk_medium_has_category_set_medium1`
    FOREIGN KEY (`medium_id`)
    REFERENCES `FIPOP`.`medium` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_medium_has_category_set_category_set1`
    FOREIGN KEY (`category_set_id`)
    REFERENCES `FIPOP`.`category_set` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_medium_has_category_set_category_set1_idx` ON `FIPOP`.`medium_has_category_set` (`category_set_id` ASC);

CREATE INDEX `fk_medium_has_category_set_medium1_idx` ON `FIPOP`.`medium_has_category_set` (`medium_id` ASC);

