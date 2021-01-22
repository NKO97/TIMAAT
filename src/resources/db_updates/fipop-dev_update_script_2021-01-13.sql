ALTER TABLE `FIPOP`.`annotation` CHANGE `sequence_start_time` `start_time` INT(11) NULL DEFAULT NULL;
ALTER TABLE `FIPOP`.`annotation` CHANGE `sequence_end_time` `end_time` INT(11) NULL DEFAULT NULL;

ALTER TABLE `FIPOP`.`analysis_segment` CHANGE `segment_start_time` `start_time` INT(11) NULL DEFAULT NULL;
ALTER TABLE `FIPOP`.`analysis_segment` CHANGE `segment_end_time` `end_time` INT(11) NULL DEFAULT NULL;

ALTER TABLE `FIPOP`.`analysis_segment_translation` CHANGE `title` `name` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL;
ALTER TABLE `FIPOP`.`analysis_segment_translation` ADD `transcript` TEXT NULL AFTER `comment`;