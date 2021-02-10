-- -----------------------------------------------------
-- Table `FIPOP`.`analysis_action_has_category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`analysis_action_has_category` (
  `analysis_action_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  PRIMARY KEY (`analysis_action_id`, `category_id`),
  CONSTRAINT `fk_analysis_action_has_category_analysis_action1`
    FOREIGN KEY (`analysis_action_id`)
    REFERENCES `FIPOP`.`analysis_action` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_analysis_action_has_category_category1`
    FOREIGN KEY (`category_id`)
    REFERENCES `FIPOP`.`category` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_analysis_action_has_category_category1_idx` ON `FIPOP`.`analysis_action_has_category` (`category_id` ASC);
CREATE INDEX `fk_analysis_action_has_category_analysis_action1_idx` ON `FIPOP`.`analysis_action_has_category` (`analysis_action_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`analysis_scene_has_category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`analysis_scene_has_category` (
  `analysis_scene_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  PRIMARY KEY (`analysis_scene_id`, `category_id`),
  CONSTRAINT `fk_analysis_scene_has_category_analysis_scene1`
    FOREIGN KEY (`analysis_scene_id`)
    REFERENCES `FIPOP`.`analysis_scene` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_analysis_scene_has_category_category1`
    FOREIGN KEY (`category_id`)
    REFERENCES `FIPOP`.`category` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_analysis_scene_has_category_category1_idx` ON `FIPOP`.`analysis_scene_has_category` (`category_id` ASC);
CREATE INDEX `fk_analysis_scene_has_category_analysis_scene1_idx` ON `FIPOP`.`analysis_scene_has_category` (`analysis_scene_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`analysis_segment_has_category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`analysis_segment_has_category` (
  `analysis_segment_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  PRIMARY KEY (`analysis_segment_id`, `category_id`),
  CONSTRAINT `fk_analysis_segment_has_category_analysis_segment1`
    FOREIGN KEY (`analysis_segment_id`)
    REFERENCES `FIPOP`.`analysis_segment` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_analysis_segment_has_category_category1`
    FOREIGN KEY (`category_id`)
    REFERENCES `FIPOP`.`category` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_analysis_segment_has_category_category1_idx` ON `FIPOP`.`analysis_segment_has_category` (`category_id` ASC);
CREATE INDEX `fk_analysis_segment_has_category_analysis_segment1_idx` ON `FIPOP`.`analysis_segment_has_category` (`analysis_segment_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`analysis_sequence_has_category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`analysis_sequence_has_category` (
  `analysis_sequence_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  PRIMARY KEY (`analysis_sequence_id`, `category_id`),
  CONSTRAINT `fk_analysis_sequence_has_category_analysis_sequence1`
    FOREIGN KEY (`analysis_sequence_id`)
    REFERENCES `FIPOP`.`analysis_sequence` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_analysis_sequence_has_category_category1`
    FOREIGN KEY (`category_id`)
    REFERENCES `FIPOP`.`category` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_analysis_sequence_has_category_category1_idx` ON `FIPOP`.`analysis_sequence_has_category` (`category_id` ASC);
CREATE INDEX `fk_analysis_sequence_has_category_analysis_sequence1_idx` ON `FIPOP`.`analysis_sequence_has_category` (`analysis_sequence_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`analysis_take_has_category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`analysis_take_has_category` (
  `analysis_take_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  PRIMARY KEY (`analysis_take_id`, `category_id`),
  CONSTRAINT `fk_analysis_take_has_category_analysis_take1`
    FOREIGN KEY (`analysis_take_id`)
    REFERENCES `FIPOP`.`analysis_take` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_analysis_take_has_category_category1`
    FOREIGN KEY (`category_id`)
    REFERENCES `FIPOP`.`category` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_analysis_take_has_category_category1_idx` ON `FIPOP`.`analysis_take_has_category` (`category_id` ASC);
CREATE INDEX `fk_analysis_take_has_category_analysis_take1_idx` ON `FIPOP`.`analysis_take_has_category` (`analysis_take_id` ASC);
