START TRANSACTION;
USE `FIPOP`;
DELETE FROM `FIPOP`.`analysis_method_type_translation` WHERE  `id`=2;
DELETE FROM `FIPOP`.`analysis_method_type_translation` WHERE  `id`=4;
COMMIT;

START TRANSACTION;
USE `FIPOP`;
DELETE FROM `FIPOP`.`analysis_method_type` WHERE  `id`=2;
DELETE FROM `FIPOP`.`analysis_method_type` WHERE  `id`=4;
COMMIT;

ALTER TABLE `FIPOP`.`membership_details`
	DROP FOREIGN KEY `fk_membership_details_actor_person_is_member_of_actor_collect1`,
	DROP FOREIGN KEY `fk_membership_details_role1`;
ALTER TABLE `FIPOP`.`membership_details`
	ADD CONSTRAINT `fk_membership_details_actor_person_is_member_of_actor_collect1` FOREIGN KEY (`actor_person_actor_id`, `member_of_actor_collective_actor_id`) REFERENCES `fipop`.`actor_person_is_member_of_actor_collective` (`actor_person_actor_id`, `member_of_actor_collective_actor_id`) ON UPDATE NO ACTION ON DELETE CASCADE,
	ADD CONSTRAINT `fk_membership_details_role1` FOREIGN KEY (`role_id`) REFERENCES `fipop`.`role` (`id`) ON UPDATE NO ACTION ON DELETE SET NULL;
