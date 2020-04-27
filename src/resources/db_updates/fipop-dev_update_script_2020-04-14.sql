-- -----------------------------------------------------
-- Table `FIPOP`.`membership_details`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`membership_details` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `actor_person_actor_id` INT NOT NULL,
  `member_of_actor_collective_actor_id` INT NOT NULL,
  `role_id` INT NULL,
  `joined_at` DATE NULL,
  `left_at` DATE NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_membership_details_actor_person_is_member_of_actor_collect1`
    FOREIGN KEY (`actor_person_actor_id` , `member_of_actor_collective_actor_id`)
    REFERENCES `FIPOP`.`actor_person_is_member_of_actor_collective` (`actor_person_actor_id` , `member_of_actor_collective_actor_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_membership_details_role1`
    FOREIGN KEY (`role_id`)
    REFERENCES `FIPOP`.`role` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_membership_details_actor_person_is_member_of_actor_colle_idx` ON `FIPOP`.`membership_details` (`actor_person_actor_id` ASC, `member_of_actor_collective_actor_id` ASC);
CREATE INDEX `fk_membership_details_role1_idx` ON `FIPOP`.`membership_details` (`role_id` ASC);

ALTER TABLE `FIPOP`.`actor_person_is_member_of_actor_collective` DROP `joined_at`;
ALTER TABLE `FIPOP`.`actor_person_is_member_of_actor_collective` DROP `left_at`;

ALTER TABLE `FIPOP`.`annotation_translation` CHANGE `title` `title` VARCHAR(255) NULL DEFAULT NULL;
ALTER TABLE `FIPOP`.`annotation_translation` CHANGE `comment` `comment` VARCHAR(4096) NULL DEFAULT NULL;