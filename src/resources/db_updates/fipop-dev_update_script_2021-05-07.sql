DROP TABLE IF EXISTS `FIPOP`.`concept_camera_movement_and_handling`;

ALTER TABLE `FIPOP`.`camera_movement` ADD `camera_handling_analysis_method_id` INT(11) NULL AFTER `camera_movement_characteristic_analysis_method_id`;
ALTER TABLE `FIPOP`.`camera_movement` ADD CONSTRAINT `fk_camera_movement_camera_handling1` FOREIGN KEY (`camera_handling_analysis_method_id`) REFERENCES `FIPOP`.`camera_handling` (`analysis_method_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX `fk_camera_movement_camera_handling1_idx` ON `FIPOP`.`camera_movement` (`camera_handling_analysis_method_id` ASC);

ALTER TABLE `concept_camera_position_and_perspective` CHANGE `camera_distance_analysis_method_id` `camera_distance_analysis_method_id` INT(11) NULL;
ALTER TABLE `concept_camera_position_and_perspective` CHANGE `camera_shot_type_analysis_method_id` `camera_shot_type_analysis_method_id` INT(11) NULL;
ALTER TABLE `concept_camera_position_and_perspective` CHANGE `camera_vertical_angle_analysis_method_id` `camera_vertical_angle_analysis_method_id` INT(11) NULL;
ALTER TABLE `concept_camera_position_and_perspective` CHANGE `camera_horizontal_angle_analysis_method_id` `camera_horizontal_angle_analysis_method_id` INT(11) NULL;
ALTER TABLE `concept_camera_position_and_perspective` CHANGE `camera_axis_of_action_analysis_method_id` `camera_axis_of_action_analysis_method_id` INT(11) NULL;
ALTER TABLE `concept_camera_position_and_perspective` CHANGE `camera_elevation_analysis_method_id` `camera_elevation_analysis_method_id` INT(11) NULL;
