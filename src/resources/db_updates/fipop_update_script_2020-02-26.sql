ALTER TABLE `FIPOP`.`actor` CHANGE `is_fictional` `is_fictional` TINYINT(1) NULL DEFAULT NULL;

ALTER TABLE `FIPOP`.`actor` DROP FOREIGN KEY `fk_actor_actor_name1`; ALTER TABLE `FIPOP`.`actor` ADD CONSTRAINT `fk_actor_actor_name1` FOREIGN KEY (`birth_name_actor_name_id`) REFERENCES `actor_name`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION; 

ALTER TABLE `FIPOP`.`actor_has_address` DROP FOREIGN KEY `fk_actor_has_address_actor1`; ALTER TABLE `FIPOP`.`actor_has_address` ADD CONSTRAINT `fk_actor_has_address_actor1` FOREIGN KEY (`actor_id`) REFERENCES `actor`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION; ALTER TABLE `FIPOP`.`actor_has_address` DROP FOREIGN KEY `fk_actor_has_address_address1`; ALTER TABLE `FIPOP`.`actor_has_address` ADD CONSTRAINT `fk_actor_has_address_address1` FOREIGN KEY (`address_id`) REFERENCES `address`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION; 

ALTER TABLE `FIPOP`.`actor_has_email_address` DROP FOREIGN KEY `fk_actor_has_email_address_actor1`; ALTER TABLE `FIPOP`.`actor_has_email_address` ADD CONSTRAINT `fk_actor_has_email_address_actor1` FOREIGN KEY (`actor_id`) REFERENCES `actor`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION; ALTER TABLE `FIPOP`.`actor_has_email_address` DROP FOREIGN KEY `fk_actor_has_email_address_email_address1`; ALTER TABLE `FIPOP`.`actor_has_email_address` ADD CONSTRAINT `fk_actor_has_email_address_email_address1` FOREIGN KEY (`email_address_id`) REFERENCES `email_address`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION; 

ALTER TABLE `FIPOP`.`actor_has_phone_number` ADD `phone_number_type_id` INT NULL AFTER `phone_number_id`; ALTER TABLE `FIPOP`.`actor_has_phone_number` DROP FOREIGN KEY `fk_actor_has_phone_number_actor1`; ALTER TABLE `FIPOP`.`actor_has_phone_number` ADD CONSTRAINT `fk_actor_has_phone_number_actor1` FOREIGN KEY (`actor_id`) REFERENCES `actor`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION; ALTER TABLE `FIPOP`.`actor_has_phone_number` DROP FOREIGN KEY `fk_actor_has_phone_number_phone_number1`; ALTER TABLE `FIPOP`.`actor_has_phone_number` ADD CONSTRAINT `fk_actor_has_phone_number_phone_number1` FOREIGN KEY (`phone_number_id`) REFERENCES `phone_number`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION; ALTER TABLE `FIPOP`.`actor_has_phone_number` ADD CONSTRAINT `fk_actor_has_phone_number_type1` FOREIGN KEY (`phone_number_type_id`) REFERENCES `phone_number_type`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION; ALTER TABLE `FIPOP`.`actor_has_phone_number` ADD INDEX `fk_actor_has_phone_number_phone_number_type1_idx` (`phone_number_type_id`); 

ALTER TABLE `FIPOP`.`actor_person` ADD `title` VARCHAR(100) NULL AFTER `day_of_death`; ALTER TABLE `FIPOP`.`actor_person` DROP FOREIGN KEY `fk_person_academic_title1`; ALTER TABLE `FIPOP`.`actor_person` DROP FOREIGN KEY `fk_person_actor1`; ALTER TABLE `FIPOP`.`actor_person` ADD CONSTRAINT `fk_actor_person_actor1` FOREIGN KEY (`actor_id`) REFERENCES `actor`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION; ALTER TABLE `FIPOP`.`actor_person` DROP FOREIGN KEY `fk_person_city_location1`; ALTER TABLE `FIPOP`.`actor_person` ADD CONSTRAINT `fk_actor_person_city_location1` FOREIGN KEY (`place_of_birth_city_location_id`) REFERENCES `city`(`location_id`) ON DELETE NO ACTION ON UPDATE NO ACTION; ALTER TABLE `FIPOP`.`actor_person` DROP FOREIGN KEY `fk_person_city_location2`; ALTER TABLE `FIPOP`.`actor_person` ADD CONSTRAINT `fk_actor_person_city_location2` FOREIGN KEY (`place_of_death_city_location_id`) REFERENCES `city`(`location_id`) ON DELETE NO ACTION ON UPDATE NO ACTION; ALTER TABLE `FIPOP`.`actor_person` DROP FOREIGN KEY `fk_person_sex1`; ALTER TABLE `FIPOP`.`actor_person` ADD CONSTRAINT `fk_actor_person_sex1` FOREIGN KEY (`sex_id`) REFERENCES `sex`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION; ALTER TABLE `FIPOP`.`actor_person` DROP INDEX `fk_person_academic_title1_idx`; ALTER TABLE `FIPOP`.`actor_person` DROP INDEX `fk_person_sex1_idx`, ADD INDEX `fk_actor_person_sex1_idx` (`sex_id`) USING BTREE; ALTER TABLE `FIPOP`.`actor_person` DROP INDEX `fk_person_city_location1_idx`, ADD INDEX `fk_actor_person_city_location1_idx` (`place_of_birth_city_location_id`) USING BTREE; ALTER TABLE `FIPOP`.`actor_person` DROP INDEX `fk_person_city_location2_idx`, ADD INDEX `fk_actor_person_city_location2_idx` (`place_of_death_city_location_id`) USING BTREE; 

ALTER TABLE `FIPOP`.`actor_person_has_citizenship` DROP FOREIGN KEY `fk_actor_person_has_citizenship_citizenship1`; ALTER TABLE `FIPOP`.`actor_person_has_citizenship` ADD CONSTRAINT `fk_actor_person_has_citizenship_citizenship1` FOREIGN KEY (`citizenship_id`) REFERENCES `citizenship`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION; ALTER TABLE `FIPOP`.`actor_person_has_citizenship` DROP FOREIGN KEY `fk_actor_person_has_citizenship_person1`; ALTER TABLE `FIPOP`.`actor_person_has_citizenship` ADD CONSTRAINT `fk_actor_person_has_citizenship_person1` FOREIGN KEY (`actor_person_actor_id`) REFERENCES `actor_person`(`actor_id`) ON DELETE CASCADE ON UPDATE NO ACTION; 

ALTER TABLE `FIPOP`.`actor_person_is_member_of_actor_collective` CHANGE `joined` `joined_at` DATE NULL DEFAULT NULL; ALTER TABLE `FIPOP`.`actor_person_is_member_of_actor_collective` CHANGE `left` `left_at` DATE NULL DEFAULT NULL;

ALTER TABLE `FIPOP`.`actor_person_translation` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT; ALTER TABLE `FIPOP`.`actor_person_translation` CHANGE `special_features` `special_features` VARCHAR(4096) NOT NULL; 

ALTER TABLE `FIPOP`.`address` CHANGE `street_address_number` `street_number` VARCHAR(10) DEFAULT NULL; ALTER TABLE `FIPOP`.`address` CHANGE `street_address_addition` `street_addition` VARCHAR(50) DEFAULT NULL;

ALTER TABLE `FIPOP`.`citizenship` ADD `dummy` TINYINT(1) NULL AFTER `id`;

ALTER TABLE `FIPOP`.`phone_number` CHANGE `phone_number` `phone_number` VARCHAR(30) NOT NULL AFTER `id`; ALTER TABLE `FIPOP`.`phone_number` DROP FOREIGN KEY `fk_PhoneNumber_Country1`; ALTER TABLE `FIPOP`.`phone_number` DROP FOREIGN KEY `fk_PhoneNumber_PhoneNumberType1`; ALTER TABLE `FIPOP`.`phone_number` DROP INDEX `fk_phone_number_country1_idx`; ALTER TABLE `FIPOP`.`phone_number` DROP INDEX `fk_phone_number_phone_number_type1_idx`; ALTER TABLE `FIPOP`.`phone_number` DROP `idd_prefix_country_location_id`; ALTER TABLE `FIPOP`.`phone_number` DROP `area_code`; ALTER TABLE `FIPOP`.`phone_number` DROP `phone_number_type_id`; 

DROP TABLE `FIPOP`.`academic_title`;

START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`address_type` (`id`) VALUES (1);
INSERT INTO `FIPOP`.`address_type` (`id`) VALUES (2);
INSERT INTO `FIPOP`.`address_type` (`id`) VALUES (3);
INSERT INTO `FIPOP`.`address_type` (`id`) VALUES (4);
COMMIT;

START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`address_type_translation` (`id`, `address_type_id`, `language_id`, `type`) VALUES (1, 1, 1, ' ');
INSERT INTO `FIPOP`.`address_type_translation` (`id`, `address_type_id`, `language_id`, `type`) VALUES (2, 2, 1, 'business');
INSERT INTO `FIPOP`.`address_type_translation` (`id`, `address_type_id`, `language_id`, `type`) VALUES (3, 3, 1, 'home');
INSERT INTO `FIPOP`.`address_type_translation` (`id`, `address_type_id`, `language_id`, `type`) VALUES (4, 4, 1, 'other');
COMMIT;

START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`email_address_type` (`id`) VALUES (1);
INSERT INTO `FIPOP`.`email_address_type` (`id`) VALUES (2);
INSERT INTO `FIPOP`.`email_address_type` (`id`) VALUES (3);
INSERT INTO `FIPOP`.`email_address_type` (`id`) VALUES (4);
INSERT INTO `FIPOP`.`email_address_type` (`id`) VALUES (5);
INSERT INTO `FIPOP`.`email_address_type` (`id`) VALUES (6);
COMMIT;

START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`email_address_type_translation` (`id`, `email_address_type_id`, `language_id`, `type`) VALUES (1, 1, 1, ' ');
INSERT INTO `FIPOP`.`email_address_type_translation` (`id`, `email_address_type_id`, `language_id`, `type`) VALUES (2, 2, 1, 'home');
INSERT INTO `FIPOP`.`email_address_type_translation` (`id`, `email_address_type_id`, `language_id`, `type`) VALUES (3, 3, 1, 'work');
INSERT INTO `FIPOP`.`email_address_type_translation` (`id`, `email_address_type_id`, `language_id`, `type`) VALUES (4, 4, 1, 'other');
INSERT INTO `FIPOP`.`email_address_type_translation` (`id`, `email_address_type_id`, `language_id`, `type`) VALUES (5, 5, 1, 'mobile');
INSERT INTO `FIPOP`.`email_address_type_translation` (`id`, `email_address_type_id`, `language_id`, `type`) VALUES (6, 6, 1, 'custom');
COMMIT;

START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`phone_number_type` (`id`) VALUES (1);
INSERT INTO `FIPOP`.`phone_number_type` (`id`) VALUES (2);
INSERT INTO `FIPOP`.`phone_number_type` (`id`) VALUES (3);
INSERT INTO `FIPOP`.`phone_number_type` (`id`) VALUES (4);
INSERT INTO `FIPOP`.`phone_number_type` (`id`) VALUES (5);
INSERT INTO `FIPOP`.`phone_number_type` (`id`) VALUES (6);
INSERT INTO `FIPOP`.`phone_number_type` (`id`) VALUES (7);
COMMIT;

START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`phone_number_type_translation` (`id`, `phone_number_type_id`, `language_id`, `type`) VALUES (1, 1, 1, ' ');
INSERT INTO `FIPOP`.`phone_number_type_translation` (`id`, `phone_number_type_id`, `language_id`, `type`) VALUES (2, 2, 1, 'mobile');
INSERT INTO `FIPOP`.`phone_number_type_translation` (`id`, `phone_number_type_id`, `language_id`, `type`) VALUES (3, 3, 1, 'home');
INSERT INTO `FIPOP`.`phone_number_type_translation` (`id`, `phone_number_type_id`, `language_id`, `type`) VALUES (4, 4, 1, 'work');
INSERT INTO `FIPOP`.`phone_number_type_translation` (`id`, `phone_number_type_id`, `language_id`, `type`) VALUES (5, 5, 1, 'pager');
INSERT INTO `FIPOP`.`phone_number_type_translation` (`id`, `phone_number_type_id`, `language_id`, `type`) VALUES (6, 6, 1, 'other');
INSERT INTO `FIPOP`.`phone_number_type_translation` (`id`, `phone_number_type_id`, `language_id`, `type`) VALUES (7, 7, 1, 'custom');
COMMIT;

START TRANSACTION;
USE `FIPOP`;
UPDATE `user_log_event_type` SET `type` = 'categoryCreated' WHERE `user_log_event_type`.`id` = 77;
UPDATE `user_log_event_type` SET `type` = 'categoryEdited' WHERE `user_log_event_type`.`id` = 78;
UPDATE `user_log_event_type` SET `type` = 'categoryDeleted' WHERE `user_log_event_type`.`id` = 79;
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (95, 'personCreated');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (96, 'personEdited');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (97, 'personDeleted');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (98, 'citizenshipCreated');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (99, 'citizenshipEdited');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (100, 'citizenshipDeleted');
COMMIT;