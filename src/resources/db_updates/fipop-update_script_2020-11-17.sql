-- -----------------------------------------------------
-- Table `FIPOP`.`medium_analysis_list_has_category_set`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`medium_analysis_list_has_category_set` (
  `medium_analysis_list_id` INT NOT NULL,
  `category_set_id` INT NOT NULL,
  PRIMARY KEY (`medium_analysis_list_id`, `category_set_id`),
  CONSTRAINT `fk_medium_analysis_list_has_category_set_medium_analysis_list1`
    FOREIGN KEY (`medium_analysis_list_id`)
    REFERENCES `FIPOP`.`medium_analysis_list` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_medium_analysis_list_has_category_set_category_set1`
    FOREIGN KEY (`category_set_id`)
    REFERENCES `FIPOP`.`category_set` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_medium_analysis_list_has_category_set_category_set1_idx` ON `FIPOP`.`medium_analysis_list_has_category_set` (`category_set_id` ASC);

CREATE INDEX `fk_medium_analysis_list_has_category_set_medium_analysis_li_idx` ON `FIPOP`.`medium_analysis_list_has_category_set` (`medium_analysis_list_id` ASC);


START TRANSACTION;
USE `FIPOP`;
DELETE FROM `FIPOP`.`analysis_method` WHERE  `id`=66;
DELETE FROM `FIPOP`.`analysis_method` WHERE  `id`=67;
DELETE FROM `FIPOP`.`analysis_method` WHERE  `id`=68;
COMMIT;

START TRANSACTION;
USE `FIPOP`;
DELETE FROM `FIPOP`.`analysis_method_type_translation` WHERE  `id`=2;
DELETE FROM `FIPOP`.`analysis_method_type_translation` WHERE  `id`=3;
DELETE FROM `FIPOP`.`analysis_method_type_translation` WHERE  `id`=4;
DELETE FROM `FIPOP`.`analysis_method_type_translation` WHERE  `id`=5;
DELETE FROM `FIPOP`.`analysis_method_type_translation` WHERE  `id`=6;
DELETE FROM `FIPOP`.`analysis_method_type_translation` WHERE  `id`=18;
DELETE FROM `FIPOP`.`analysis_method_type_translation` WHERE  `id`=19;
COMMIT;

START TRANSACTION;
USE `FIPOP`;
DELETE FROM `FIPOP`.`analysis_method_type` WHERE  `id`=2;
DELETE FROM `FIPOP`.`analysis_method_type` WHERE  `id`=3;
DELETE FROM `FIPOP`.`analysis_method_type` WHERE  `id`=4;
DELETE FROM `FIPOP`.`analysis_method_type` WHERE  `id`=5;
DELETE FROM `FIPOP`.`analysis_method_type` WHERE  `id`=6;
DELETE FROM `FIPOP`.`analysis_method_type` WHERE  `id`=18;
DELETE FROM `FIPOP`.`analysis_method_type` WHERE  `id`=19;
COMMIT;

ALTER TABLE `FIPOP`.`membership_details`
	DROP FOREIGN KEY `fk_membership_details_actor_person_is_member_of_actor_collect1`,
	DROP FOREIGN KEY `fk_membership_details_role1`;
ALTER TABLE `FIPOP`.`membership_details`
	ADD CONSTRAINT `fk_membership_details_actor_person_is_member_of_actor_collect1` FOREIGN KEY (`actor_person_actor_id`, `member_of_actor_collective_actor_id`) REFERENCES `fipop`.`actor_person_is_member_of_actor_collective` (`actor_person_actor_id`, `member_of_actor_collective_actor_id`) ON UPDATE NO ACTION ON DELETE CASCADE,
	ADD CONSTRAINT `fk_membership_details_role1` FOREIGN KEY (`role_id`) REFERENCES `fipop`.`role` (`id`) ON UPDATE NO ACTION ON DELETE SET NULL;

DROP TABLE IF EXISTS `FIPOP`.`genette_narrative_discourse`;
DROP TABLE IF EXISTS `FIPOP`.`stanzel_narrative_situations`;
DROP TABLE IF EXISTS `FIPOP`.`temporal_order_translation`;
DROP TABLE IF EXISTS `FIPOP`.`temporal_order`;
DROP TABLE IF EXISTS `FIPOP`.`frequency_of_events_translation`;
DROP TABLE IF EXISTS `FIPOP`.`frequency_of_events`;
DROP TABLE IF EXISTS `FIPOP`.`narrative_movement_translation`;
DROP TABLE IF EXISTS `FIPOP`.`narrative_movement`;
DROP TABLE IF EXISTS `FIPOP`.`narrative_distance_translation`;
DROP TABLE IF EXISTS `FIPOP`.`narrative_distance`;
DROP TABLE IF EXISTS `FIPOP`.`narrative_focalization_translation`;
DROP TABLE IF EXISTS `FIPOP`.`narrative_focalization`;
DROP TABLE IF EXISTS `FIPOP`.`time_of_the_narrating_translation`;
DROP TABLE IF EXISTS `FIPOP`.`time_of_the_narrating`;
DROP TABLE IF EXISTS `FIPOP`.`narrative_level_translation`;
DROP TABLE IF EXISTS `FIPOP`.`narrative_level`;
DROP TABLE IF EXISTS `FIPOP`.`narrator_relationship_translation`;
DROP TABLE IF EXISTS `FIPOP`.`narrator_relationship`;
DROP TABLE IF EXISTS `FIPOP`.`actantial_model_facet_type_translation`;
DROP TABLE IF EXISTS `FIPOP`.`actantial_model_facet_type`;
DROP TABLE IF EXISTS `FIPOP`.`greimas_actantial_model_has_actor`;
DROP TABLE IF EXISTS `FIPOP`.`greimas_actantial_model_has_concept`;
DROP TABLE IF EXISTS `FIPOP`.`greimas_actantial_model_translation`;
DROP TABLE IF EXISTS `FIPOP`.`greimas_actantial_model`;
DROP TABLE IF EXISTS `FIPOP`.`ideology_has_ideologeme`;
DROP TABLE IF EXISTS `FIPOP`.`ideologeme`;
DROP TABLE IF EXISTS `FIPOP`.`lexia_has_connoted_image`;
DROP TABLE IF EXISTS `FIPOP`.`connoted_image`;
DROP TABLE IF EXISTS `FIPOP`.`lexia_has_denoted_image`;
DROP TABLE IF EXISTS `FIPOP`.`denoted_image`;
DROP TABLE IF EXISTS `FIPOP`.`lexia_has_linguistic_message`;
DROP TABLE IF EXISTS `FIPOP`.`linguistic_message`;
DROP TABLE IF EXISTS `FIPOP`.`ideology`;
DROP TABLE IF EXISTS `FIPOP`.`lexia`;
DROP TABLE IF EXISTS `FIPOP`.`barthes_rhetoric_of_the_image`;
DROP TABLE IF EXISTS `FIPOP`.`narrative_situation_translation`;
DROP TABLE IF EXISTS `FIPOP`.`narrative_situation`;
DROP TABLE IF EXISTS `FIPOP`.`pfister_figural_characterization`;
DROP TABLE IF EXISTS `FIPOP`.`spatial_semantics_type_actor_person_translation`;
DROP TABLE IF EXISTS `FIPOP`.`spatial_semantics_type_actor_person`;
DROP TABLE IF EXISTS `FIPOP`.`spatial_semantics_type_space_translation`;
DROP TABLE IF EXISTS `FIPOP`.`spatial_semantics_type_space`;
DROP TABLE IF EXISTS `FIPOP`.`level_of_concrete_action_translation`;
DROP TABLE IF EXISTS `FIPOP`.`level_of_concrete_action`;
DROP TABLE IF EXISTS `FIPOP`.`lotman_renner_spatial_semantics`;
DROP TABLE IF EXISTS `FIPOP`.`van_sijll_cinematic_storytelling_translation`;
DROP TABLE IF EXISTS `FIPOP`.`van_sijll_cinematic_storytelling`;
DROP TABLE IF EXISTS `FIPOP`.`cinematic_storytelling_convention_translation`;
DROP TABLE IF EXISTS `FIPOP`.`cinematic_storytelling_convention`;
DROP TABLE IF EXISTS `FIPOP`.`zelizer_beese_voice_of_the_visual_translation`;
DROP TABLE IF EXISTS `FIPOP`.`zelizer_beese_voice_of_the_visual`;