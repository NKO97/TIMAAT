ALTER TABLE `FIPOP`.`address` ADD `street` VARCHAR(100) NULL AFTER `street_location_id`;
ALTER TABLE `FIPOP`.`address` ADD `city` VARCHAR(100) NULL AFTER `street_addition`;
ALTER TABLE `FIPOP`.`address` DROP FOREIGN KEY `fk_address_street1`;

ALTER TABLE `FIPOP`.`address` DROP INDEX `fk_address_street1_idx`;
ALTER TABLE `FIPOP`.`address` DROP `street_location_id`;