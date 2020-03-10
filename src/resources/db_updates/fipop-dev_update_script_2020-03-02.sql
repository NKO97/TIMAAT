ALTER TABLE `annotation` CHANGE `uuid_id` `uuid_id` INT(11) NULL; 
ALTER TABLE `annotation` CHANGE `iri_id` `iri_id` INT(11) NULL; 

ALTER TABLE `event` CHANGE `begins_at_date` `began_at` TIMESTAMP NULL; 
ALTER TABLE `event` CHANGE `ends_at_date` `ended_at` TIMESTAMP NULL; 