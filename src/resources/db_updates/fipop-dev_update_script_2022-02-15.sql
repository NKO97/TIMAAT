-- -----------------------------------------------------
-- Table `FIPOP`.`music_change_in_tempo_element`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_change_in_tempo_element` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `music_id` INT NOT NULL,
  `change_in_tempo_id` INT NOT NULL,
  `start_time` INT(11) NOT NULL,
  `end_time` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_music_change_in_tempo_element_music1`
    FOREIGN KEY (`music_id`)
    REFERENCES `FIPOP`.`music` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_change_in_tempo_element_change_in_tempo1`
    FOREIGN KEY (`change_in_tempo_id`)
    REFERENCES `FIPOP`.`change_in_tempo` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_change_in_tempo_element_music1_idx` ON `FIPOP`.`music_change_in_tempo_element` (`music_id` ASC);

CREATE INDEX `fk_music_change_in_tempo_element_change_in_tempo1_idx` ON `FIPOP`.`music_change_in_tempo_element` (`change_in_tempo_id` ASC);

