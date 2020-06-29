ALTER TABLE `FIPOP`.`actor_has_role` DROP FOREIGN KEY `fk_actor_has_role_actor1`; 
ALTER TABLE `FIPOP`.`actor_has_role` ADD CONSTRAINT `fk_actor_has_role_actor1` FOREIGN KEY (`actor_id`) REFERENCES `actor`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`actor_has_role` DROP FOREIGN KEY `fk_actor_has_role_role1`; 
ALTER TABLE `FIPOP`.`actor_has_role` ADD CONSTRAINT `fk_actor_has_role_role1` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`medium_has_actor_with_role` DROP FOREIGN KEY `fk_medium_has_actor_with_role_actor_has_role1`; 
ALTER TABLE `FIPOP`.`medium_has_actor_with_role` ADD CONSTRAINT `fk_medium_has_actor_with_role_actor_has_role1` FOREIGN KEY (`actor_has_role_actor_id`, `actor_has_role_role_id`) REFERENCES `actor_has_role`(`actor_id`, `role_id`) ON DELETE CASCADE ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`medium_has_actor_with_role` DROP FOREIGN KEY `fk_medium_has_actor_with_role_medium1`; 
ALTER TABLE `FIPOP`.`medium_has_actor_with_role` ADD CONSTRAINT `fk_medium_has_actor_with_role_medium1` FOREIGN KEY (`medium_id`) REFERENCES `medium`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;