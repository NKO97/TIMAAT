ALTER TABLE `FIPOP`.`actor` ADD `display_name_actor_name_id` INT (11) NULL AFTER `actor_type_id`; 
ALTER TABLE `FIPOP`.`actor` ADD CONSTRAINT `fk_actor_actor_name2` FOREIGN KEY (`display_name_actor_name_id`) REFERENCES `FIPOP`.`actor_name`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`actor` ADD INDEX `fk_actor_actor_name2_idx` (`display_name_actor_name_id`); 

UPDATE `FIPOP`.`actor` INNER JOIN `FIPOP`.`actor_name` ON `FIPOP`.`actor`.`id` = `FIPOP`.`actor_name`.`actor_id` SET `FIPOP`.`actor`.`display_name_actor_name_id` = `FIPOP`.`actor_name`.`id` WHERE `FIPOP`.`actor_name`.`is_display_name` = 1;

ALTER TABLE `FIPOP`.`actor_name` DROP `is_display_name`;

ALTER TABLE `FIPOP`.`role_group_has_role` DROP FOREIGN KEY `fk_role_group_has_role_role_groups1`; 
ALTER TABLE `FIPOP`.`role_group_has_role` ADD CONSTRAINT `fk_role_group_has_role_role_groups1` FOREIGN KEY (`role_group_id`) REFERENCES `FIPOP`.`role_group` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`role_group_has_role` DROP FOREIGN KEY `fk_role_group_has_role_role1`; 
ALTER TABLE `FIPOP`.`role_group_has_role` ADD CONSTRAINT `fk_role_group_has_role_role1` FOREIGN KEY (`role_id`) REFERENCES `FIPOP`.`role` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION; 