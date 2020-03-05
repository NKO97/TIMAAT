ALTER TABLE `annotation` CHANGE `sequence_start_time` `sequence_start_time` INT(11); 
ALTER TABLE `annotation` CHANGE `sequence_end_time` `sequence_end_time` INT(11); 
UPDATE `annotation` SET `sequence_start_time` = `sequence_start_time`*1000;
UPDATE `annotation` SET `sequence_end_time` = `sequence_end_time`*1000;
