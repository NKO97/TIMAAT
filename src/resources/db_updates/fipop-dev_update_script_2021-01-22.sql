ALTER TABLE `FIPOP`.`medium` ADD `recording_start_date` DATE NULL AFTER `release_date`;
ALTER TABLE `FIPOP`.`medium` ADD `recording_end_date` DATE NULL AFTER `recording_start_date`;