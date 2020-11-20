ALTER TABLE `FIPOP`.`analysis_segment` CHANGE `segment_start_time` `segment_start_time` INT NULL DEFAULT NULL;
ALTER TABLE `FIPOP`.`analysis_segment` CHANGE `segment_end_time` `segment_end_time` INT NULL DEFAULT NULL;

UPDATE `FIPOP`.`analysis_segment` SET  `segment_start_time` =  `segment_start_time` * 1000;
UPDATE `FIPOP`.`analysis_segment` SET  `segment_end_time` =  `segment_end_time` * 1000;