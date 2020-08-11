ALTER TABLE `FIPOP`.`medium_image` CHANGE `width` `width` INT NOT NULL;
ALTER TABLE `FIPOP`.`medium_image` CHANGE `height` `height` INT NOT NULL;

CREATE TABLE IF NOT EXISTS `FIPOP`.`actor_has_medium_image` (
  `actor_id` INT NOT NULL,
  `medium_image_medium_id` INT NOT NULL,
  PRIMARY KEY (`actor_id`, `medium_image_medium_id`),
  CONSTRAINT `fk_actor_has_medium_image_actor1`
    FOREIGN KEY (`actor_id`)
    REFERENCES `FIPOP`.`actor` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_actor_has_medium_image_medium_image1`
    FOREIGN KEY (`medium_image_medium_id`)
    REFERENCES `FIPOP`.`medium_image` (`medium_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_actor_has_medium_image_medium_image1_idx` ON `FIPOP`.`actor_has_medium_image` (`medium_image_medium_id` ASC);
CREATE INDEX `fk_actor_has_medium_image_actor1_idx` ON `FIPOP`.`actor_has_medium_image` (`actor_id` ASC);
