-- -----------------------------------------------------
-- Table `FIPOP`.`annotation_has_tag`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`annotation_has_tag` (
  `annotation_id` INT NOT NULL,
  `tag_id` INT NOT NULL,
  PRIMARY KEY (`annotation_id`, `tag_id`),
  CONSTRAINT `fk_annotation_has_tag_annotation1`
    FOREIGN KEY (`annotation_id`)
    REFERENCES `FIPOP`.`annotation` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_annotation_has_tag_tag1`
    FOREIGN KEY (`tag_id`)
    REFERENCES `FIPOP`.`tag` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_annotation_has_tag_tag1_idx` ON `FIPOP`.`annotation_has_tag` (`tag_id` ASC);

CREATE INDEX `fk_annotation_has_tag_annotation1_idx` ON `FIPOP`.`annotation_has_tag` (`annotation_id` ASC);


ALTER TABLE `event_translation` CHANGE `name` `name` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL;
ALTER TABLE `event_translation` CHANGE `description` `description` VARCHAR(4096) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL;