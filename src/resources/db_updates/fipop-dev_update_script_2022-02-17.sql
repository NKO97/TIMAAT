-- -----------------------------------------------------
-- Table `FIPOP`.`medium_has_music`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`medium_has_music` (
  `medium_id` INT NOT NULL,
  `music_id` INT NOT NULL,
  PRIMARY KEY (`medium_id`, `music_id`),
  CONSTRAINT `fk_medium_has_music_medium1`
    FOREIGN KEY (`medium_id`)
    REFERENCES `FIPOP`.`medium` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_medium_has_music_music1`
    FOREIGN KEY (`music_id`)
    REFERENCES `FIPOP`.`music` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_medium_has_music_music1_idx` ON `FIPOP`.`medium_has_music` (`music_id` ASC);

CREATE INDEX `fk_medium_has_music_medium1_idx` ON `FIPOP`.`medium_has_music` (`medium_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`medium_has_music_detail`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`medium_has_music_detail` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `medium_has_music_medium_id` INT NOT NULL,
  `medium_has_music_music_id` INT NOT NULL,
  `start_time` INT(11) NULL,
  `end_time` INT(11) NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_medium_has_music_detail_medium_has_music1`
    FOREIGN KEY (`medium_has_music_medium_id` , `medium_has_music_music_id`)
    REFERENCES `FIPOP`.`medium_has_music` (`medium_id` , `music_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_medium_has_music_detail_medium_has_music1_idx` ON `FIPOP`.`medium_has_music_detail` (`medium_has_music_medium_id` ASC, `medium_has_music_music_id` ASC);
