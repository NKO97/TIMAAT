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

ALTER TABLE `FIPOP`.`actor` ADD `display_name_actor_name_id` INT (11) NULL AFTER `actor_type_id`; 
ALTER TABLE `FIPOP`.`actor` ADD CONSTRAINT `fk_actor_actor_name2` FOREIGN KEY (`display_name_actor_name_id`) REFERENCES `FIPOP`.`actor_name`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`actor` ADD INDEX `fk_actor_actor_name2_idx` (`display_name_actor_name_id`); 

UPDATE `FIPOP`.`actor` INNER JOIN `FIPOP`.`actor_name` ON `FIPOP`.`actor`.`id` = `FIPOP`.`actor_name`.`actor_id` SET `FIPOP`.`actor`.`display_name_actor_name_id` = `FIPOP`.`actor_name`.`id` WHERE `FIPOP`.`actor_name`.`is_display_name` = 1;

ALTER TABLE `FIPOP`.`actor_name` DROP `is_display_name`;

ALTER TABLE `FIPOP`.`role_group_has_role` DROP FOREIGN KEY `fk_role_group_has_role_role_groups1`; 
ALTER TABLE `FIPOP`.`role_group_has_role` ADD CONSTRAINT `fk_role_group_has_role_role_groups1` FOREIGN KEY (`role_group_id`) REFERENCES `FIPOP`.`role_group` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`role_group_has_role` DROP FOREIGN KEY `fk_role_group_has_role_role1`; 
ALTER TABLE `FIPOP`.`role_group_has_role` ADD CONSTRAINT `fk_role_group_has_role_role1` FOREIGN KEY (`role_id`) REFERENCES `FIPOP`.`role` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION; 