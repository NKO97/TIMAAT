ALTER TABLE `FIPOP`.`actor` ADD `actor_type_id` INT(11) NOT NULL AFTER `id`; 
ALTER TABLE `FIPOP`.`actor` ADD `birth_name_actor_name_id` INT(11) NULL AFTER `actor_type_id`; 
ALTER TABLE `FIPOP`.`actor` ADD `primary_address_id` INT(11) NULL AFTER `birth_name_actor_name_id`; 
ALTER TABLE `FIPOP`.`actor` ADD `primary_email_address_id` INT(11) NULL AFTER `primary_address_id`; 
ALTER TABLE `FIPOP`.`actor` ADD `primary_phone_number_id` INT(11) NULL AFTER `primary_email_address_id`; 
ALTER TABLE `FIPOP`.`actor` CHANGE `is_fictional` `is_fictional` TINYINT(1) NULL DEFAULT NULL;
ALTER TABLE `FIPOP`.`actor` ADD CONSTRAINT `fk_actor_actor_name1` FOREIGN KEY (`birth_name_actor_name_id`) REFERENCES `FIPOP`.`actor_name`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`actor` ADD CONSTRAINT `fk_actor_phone_number1` FOREIGN KEY (`primary_phone_number_id`) REFERENCES `FIPOP`.`phone_number`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`actor` ADD CONSTRAINT `fk_actor_email_address1` FOREIGN KEY (`primary_email_address_id`) REFERENCES `FIPOP`.`email_address`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`actor` ADD CONSTRAINT `fk_actor_address1` FOREIGN KEY (`primary_address_id`) REFERENCES `FIPOP`.`address`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`actor` ADD CONSTRAINT `fk_actor_actor_type1` FOREIGN KEY (`actor_type_id`) REFERENCES `FIPOP`.`actor_type`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`actor` ADD INDEX `fk_actor_actor_name1_idx` (`birth_name_actor_name_id`); 
ALTER TABLE `FIPOP`.`actor` ADD INDEX `fk_actor_phone_number1_idx` (`primary_phone_number_id`); 
ALTER TABLE `FIPOP`.`actor` ADD INDEX `fk_actor_email_address1_idx` (`primary_email_address_id`); 
ALTER TABLE `FIPOP`.`actor` ADD INDEX `fk_actor_address1_idx` (`primary_address_id`); 
ALTER TABLE `FIPOP`.`actor` ADD INDEX `fk_actor_actor_type1_idx` (`actor_type_id`); 

ALTER TABLE `FIPOP`.`actor_has_address` DROP FOREIGN KEY `fk_actor_has_address_actor1`; 
ALTER TABLE `FIPOP`.`actor_has_address` DROP FOREIGN KEY `fk_actor_has_address_address1`; 
ALTER TABLE `FIPOP`.`actor_has_address` CHANGE `used_since` `used_from` DATE NULL DEFAULT NULL;
ALTER TABLE `FIPOP`.`actor_has_address` ADD CONSTRAINT `fk_actor_has_address_actor1` FOREIGN KEY (`actor_id`) REFERENCES `FIPOP`.`actor`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`actor_has_address` ADD CONSTRAINT `fk_actor_has_address_address1` FOREIGN KEY (`address_id`) REFERENCES `FIPOP`.`address`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`actor_has_address` DROP INDEX `fk_actor_has_address_actory1_idx`, ADD INDEX `fk_actor_has_address_actor1` (`actor_id`) USING BTREE; 

ALTER TABLE `FIPOP`.`actor_has_email_address` DROP FOREIGN KEY `fk_actor_has_email_address_actor1`; 
ALTER TABLE `FIPOP`.`actor_has_email_address` DROP FOREIGN KEY `fk_actor_has_email_address_email_address1`; 
ALTER TABLE `FIPOP`.`actor_has_email_address` ADD CONSTRAINT `fk_actor_has_email_address_actor1` FOREIGN KEY (`actor_id`) REFERENCES `FIPOP`.`actor`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`actor_has_email_address` ADD CONSTRAINT `fk_actor_has_email_address_email_address1` FOREIGN KEY (`email_address_id`) REFERENCES `FIPOP`.`email_address`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION; 

ALTER TABLE `FIPOP`.`actor_has_phone_number` DROP FOREIGN KEY `fk_actor_has_phone_number_phone_number1`; 
ALTER TABLE `FIPOP`.`actor_has_phone_number` DROP FOREIGN KEY `fk_actor_has_phone_number_actor1`; 
ALTER TABLE `FIPOP`.`actor_has_phone_number` ADD `phone_number_type_id` INT NULL AFTER `phone_number_id`; 
ALTER TABLE `FIPOP`.`actor_has_phone_number` ADD CONSTRAINT `fk_actor_has_phone_number_actor1` FOREIGN KEY (`actor_id`) REFERENCES `FIPOP`.`actor`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`actor_has_phone_number` ADD CONSTRAINT `fk_actor_has_phone_number_phone_number1` FOREIGN KEY (`phone_number_id`) REFERENCES `FIPOP`.`phone_number`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`actor_has_phone_number` ADD CONSTRAINT `fk_actor_has_phone_number_type1` FOREIGN KEY (`phone_number_type_id`) REFERENCES `FIPOP`.`phone_number_type`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`actor_has_phone_number` ADD INDEX `fk_actor_has_phone_number_phone_number_type1_idx` (`phone_number_type_id`); 

ALTER TABLE `FIPOP`.`actor_name` DROP FOREIGN KEY `fk_actor_name_actor1`; 
ALTER TABLE `FIPOP`.`actor_name` DROP `text_direction`; 
ALTER TABLE `FIPOP`.`actor_name` CHANGE `used_since` `used_from` DATE NULL DEFAULT NULL;
ALTER TABLE `FIPOP`.`actor_name` ADD `is_display_name` TINYINT(1) NULL AFTER `actor_id`; 
ALTER TABLE `FIPOP`.`actor_name` DROP `is_primary`; 
ALTER TABLE `FIPOP`.`actor_name` ADD CONSTRAINT `fk_actor_name_actor1` FOREIGN KEY (`actor_id`) REFERENCES `FIPOP`.`actor`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `FIPOP`.`collective` RENAME TO `FIPOP`.`actor_collective`;
ALTER TABLE `FIPOP`.`actor_collective` DROP FOREIGN KEY `fk_collective_actor1`;
ALTER TABLE `FIPOP`.`actor_collective` ADD CONSTRAINT `fk_actor_collective_actor1` FOREIGN KEY (`actor_id`) REFERENCES `FIPOP`.`actor`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `FIPOP`.`person` RENAME TO `FIPOP`.`actor_person`;
ALTER TABLE `FIPOP`.`actor_person` DROP FOREIGN KEY `fk_person_academic_title1`; 
ALTER TABLE `FIPOP`.`actor_person` DROP FOREIGN KEY `fk_person_actor1`; 
ALTER TABLE `FIPOP`.`actor_person` DROP FOREIGN KEY `fk_person_location1`; 
ALTER TABLE `FIPOP`.`actor_person` DROP FOREIGN KEY `fk_person_location2`; 
ALTER TABLE `FIPOP`.`actor_person` DROP FOREIGN KEY `fk_person_sex1`; 
ALTER TABLE `FIPOP`.`actor_person` ADD `title` VARCHAR(100) NULL AFTER `day_of_death`; 
ALTER TABLE `FIPOP`.`actor_person` CHANGE `place_of_birth_location_id` `place_of_birth_city_location_id` INT(11) NULL DEFAULT NULL;
ALTER TABLE `FIPOP`.`actor_person` CHANGE `place_of_death_location_id` `place_of_death_city_location_id` INT(11) NULL DEFAULT NULL;
ALTER TABLE `FIPOP`.`actor_person` ADD CONSTRAINT `fk_actor_person_actor1` FOREIGN KEY (`actor_id`) REFERENCES `FIPOP`.`actor`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`actor_person` ADD CONSTRAINT `fk_actor_person_city_location1` FOREIGN KEY (`place_of_birth_city_location_id`) REFERENCES `FIPOP`.`city`(`location_id`) ON DELETE NO ACTION ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`actor_person` ADD CONSTRAINT `fk_actor_person_city_location2` FOREIGN KEY (`place_of_death_city_location_id`) REFERENCES `FIPOP`.`city`(`location_id`) ON DELETE NO ACTION ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`actor_person` ADD CONSTRAINT `fk_actor_person_sex1` FOREIGN KEY (`sex_id`) REFERENCES `FIPOP`.`sex`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`actor_person` DROP INDEX `fk_person_academic_title1_idx`; 
ALTER TABLE `FIPOP`.`actor_person` DROP INDEX `fk_person_sex1_idx`, ADD INDEX `fk_actor_person_sex1_idx` (`sex_id`) USING BTREE; 
ALTER TABLE `FIPOP`.`actor_person` DROP INDEX `fk_person_location1_idx`, ADD INDEX `fk_actor_person_city_location1_idx` (`place_of_birth_city_location_id`) USING BTREE; 
ALTER TABLE `FIPOP`.`actor_person` DROP INDEX `fk_person_location2_idx`, ADD INDEX `fk_actor_person_city_location2_idx` (`place_of_death_city_location_id`) USING BTREE; 

ALTER TABLE `FIPOP`.`person_has_citizenship` RENAME TO `FIPOP`.`actor_person_has_citizenship`;
ALTER TABLE `FIPOP`.`actor_person_has_citizenship` DROP FOREIGN KEY `fk_person_has_citizenship_citizenship1`; 
ALTER TABLE `FIPOP`.`actor_person_has_citizenship` DROP FOREIGN KEY `fk_person_has_citizenship_person1`; 
ALTER TABLE `FIPOP`.`actor_person_has_citizenship` CHANGE `person_actor_id` `actor_person_actor_id` INT(11) NOT NULL;
ALTER TABLE `FIPOP`.`actor_person_has_citizenship` DROP PRIMARY KEY, ADD PRIMARY KEY (`actor_person_actor_id`, `citizenship_id`) USING BTREE; 
ALTER TABLE `FIPOP`.`actor_person_has_citizenship` ADD CONSTRAINT `fk_actor_person_has_citizenship_citizenship1` FOREIGN KEY (`citizenship_id`) REFERENCES `FIPOP`.`citizenship`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`actor_person_has_citizenship` ADD CONSTRAINT `fk_actor_person_has_citizenship_person1` FOREIGN KEY (`actor_person_actor_id`) REFERENCES `FIPOP`.`actor_person`(`actor_id`) ON DELETE CASCADE ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`actor_person_has_citizenship` DROP INDEX `fk_person_has_citizenship_citizenship1_idx`, ADD INDEX `fk_actor_person_has_citizenship_citizenship1_idx` (`citizenship_id`) USING BTREE;
ALTER TABLE `FIPOP`.`actor_person_has_citizenship` DROP INDEX `fk_person_has_citizenship_person1_idx`, ADD INDEX `fk_actor_person_has_citizenship_person1_idx` (`actor_person_actor_id`) USING BTREE;

ALTER TABLE `FIPOP`.`person_is_member_of_collective` RENAME TO `FIPOP`.`actor_person_is_member_of_actor_collective`;
ALTER TABLE `FIPOP`.`actor_person_is_member_of_actor_collective` DROP FOREIGN KEY `fk_person_is_member_of_collective_person1`;
ALTER TABLE `FIPOP`.`actor_person_is_member_of_actor_collective` DROP FOREIGN KEY `fk_person_is_member_of_collective_collective1`;
ALTER TABLE `FIPOP`.`actor_person_is_member_of_actor_collective` CHANGE `person_actor_id` `actor_person_actor_id` INT(11) NOT NULL;
ALTER TABLE `FIPOP`.`actor_person_is_member_of_actor_collective` CHANGE `member_of_collective_actor_id` `member_of_actor_collective_actor_id` INT(11) NOT NULL;
ALTER TABLE `FIPOP`.`actor_person_is_member_of_actor_collective` CHANGE `joined` `joined_at` DATE NULL DEFAULT NULL; 
ALTER TABLE `FIPOP`.`actor_person_is_member_of_actor_collective` CHANGE `left` `left_at` DATE NULL DEFAULT NULL;
ALTER TABLE `FIPOP`.`actor_person_is_member_of_actor_collective` DROP PRIMARY KEY, ADD PRIMARY KEY (`actor_person_actor_id`, `member_of_actor_collective_actor_id`) USING BTREE; 
ALTER TABLE `FIPOP`.`actor_person_is_member_of_actor_collective` ADD CONSTRAINT `fk_actor_person_is_member_of_actor_collective_person1` FOREIGN KEY (`actor_person_actor_id`) REFERENCES `FIPOP`.`actor_person`(`actor_id`) ON DELETE NO ACTION ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`actor_person_is_member_of_actor_collective` ADD CONSTRAINT `fk_actor_person_is_member_of_actor_collective_collective1` FOREIGN KEY (`member_of_actor_collective_actor_id`) REFERENCES `FIPOP`.`actor_collective`(`actor_id`) ON DELETE NO ACTION ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`actor_person_is_member_of_actor_collective` DROP INDEX `fk_person_is_member_of_collective_person1_idx`, ADD INDEX `fk_actor_person_is_member_of_actor_collective_person1_idx` (`actor_person_actor_id`) USING BTREE;
ALTER TABLE `FIPOP`.`actor_person_is_member_of_actor_collective` DROP INDEX `fk_person_is_member_of_collective_collective1_idx`, ADD INDEX `fk_actor_person_is_member_of_actor_collective_collective1_idx` (`member_of_actor_collective_actor_id`) USING BTREE;

ALTER TABLE `FIPOP`.`person_translation` RENAME TO `FIPOP`.`actor_person_translation`;
ALTER TABLE `FIPOP`.`actor_person_translation` DROP FOREIGN KEY `fk_person_translation_person1`;
ALTER TABLE `FIPOP`.`actor_person_translation` DROP FOREIGN KEY `fk_person_translation_language1`;
ALTER TABLE `FIPOP`.`actor_person_translation` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT; 
ALTER TABLE `FIPOP`.`actor_person_translation` CHANGE `person_actor_id` `actor_person_actor_id` INT(11) NOT NULL; 
ALTER TABLE `FIPOP`.`actor_person_translation` CHANGE `special_features` `special_features` VARCHAR(4096) NOT NULL; 
ALTER TABLE `FIPOP`.`actor_person_translation` ADD CONSTRAINT `fk_actor_person_translation_person1` FOREIGN KEY (`actor_person_actor_id`) REFERENCES `FIPOP`.`actor_person`(`actor_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`actor_person_translation` ADD CONSTRAINT `fk_actor_person_translation_language1` FOREIGN KEY (`language_id`) REFERENCES `FIPOP`.`language`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`actor_person_translation` DROP INDEX `fk_person_translation_person1_idx`, ADD INDEX `fk_actor_person_translation_person1_idx`(`actor_person_actor_id`) USING BTREE;
ALTER TABLE `FIPOP`.`actor_person_translation` DROP INDEX `fk_person_translation_language1_idx`, ADD INDEX `fk_actor_person_translation_language1_idx`(`language_id`) USING BTREE;

ALTER TABLE `FIPOP`.`address` CHANGE `street_address_number` `street_number` VARCHAR(10) NULL DEFAULT NULL; 
ALTER TABLE `FIPOP`.`address` CHANGE `street_address_addition` `street_addition` VARCHAR(50) NULL DEFAULT NULL;

ALTER TABLE `FIPOP`.`citizenship` ADD `dummy` TINYINT(1) NULL AFTER `id`;

ALTER TABLE `FIPOP`.`lineup_member` DROP FOREIGN KEY `fk_lineup_member_person_actor1`; 
ALTER TABLE `FIPOP`.`lineup_member` ADD CONSTRAINT `fk_lineup_member_person_actor1` FOREIGN KEY (`person_actor_id`) REFERENCES `FIPOP`.`actor_person`(`actor_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `FIPOP`.`phone_number` DROP FOREIGN KEY `fk_PhoneNumber_Country1`; 
ALTER TABLE `FIPOP`.`phone_number` DROP FOREIGN KEY `fk_PhoneNumber_PhoneNumberType1`; 
ALTER TABLE `FIPOP`.`phone_number` DROP INDEX `fk_phone_number_country1_idx`; 
ALTER TABLE `FIPOP`.`phone_number` DROP INDEX `fk_phone_number_phone_number_type1_idx`; 
ALTER TABLE `FIPOP`.`phone_number` DROP `idd_prefix_country_location_id`; 
ALTER TABLE `FIPOP`.`phone_number` DROP `area_code`; 
ALTER TABLE `FIPOP`.`phone_number` DROP `phone_number_type_id`; 
ALTER TABLE `FIPOP`.`phone_number` CHANGE `phone_number` `phone_number` VARCHAR(30) NOT NULL; 

ALTER TABLE `FIPOP`.`spatial_semantics_type_person` RENAME TO `FIPOP`.`spatial_semantics_type_actor_person`;
ALTER TABLE `FIPOP`.`spatial_semantics_type_actor_person` DROP FOREIGN KEY `fk_spatial_semantics_type_person_lotman_renner_spatial_semanti1`;
ALTER TABLE `FIPOP`.`spatial_semantics_type_actor_person` DROP FOREIGN KEY `fk_spatial_semantics_type_person_annotation1`; 
ALTER TABLE `FIPOP`.`spatial_semantics_type_actor_person` DROP FOREIGN KEY `fk_spatial_semantics_type_person_actor1`; 
ALTER TABLE `FIPOP`.`spatial_semantics_type_actor_person` DROP FOREIGN KEY `fk_spatial_semantics_type_person_level_of_concrete_action1`; 
ALTER TABLE `FIPOP`.`spatial_semantics_type_actor_person` ADD CONSTRAINT `fk_spatial_semantics_type_actor_person_lotman_renner_spatial_s1` FOREIGN KEY (`lotman_renner_spatial_semantics_id`) REFERENCES `FIPOP`.`lotman_renner_spatial_semantics`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`spatial_semantics_type_actor_person` ADD CONSTRAINT `fk_spatial_semantics_type_actor_person_annotation1` FOREIGN KEY (`annotation_id`) REFERENCES `FIPOP`.`annotation`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;  
ALTER TABLE `FIPOP`.`spatial_semantics_type_actor_person` ADD CONSTRAINT `fk_spatial_semantics_type_actor_person_actor1` FOREIGN KEY (`actor_id`) REFERENCES `FIPOP`.`actor`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`spatial_semantics_type_actor_person` ADD CONSTRAINT `fk_spatial_semantics_type_actor_person_level_of_concrete_action1` FOREIGN KEY (`level_of_concrete_action_id`) REFERENCES `FIPOP`.`level_of_concrete_action`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`spatial_semantics_type_actor_person` DROP INDEX `fk_spatial_semantics_type_person_lotman_renner_spatial_sema1_idx`, ADD INDEX `fk_spatial_semantics_type_actor_person_lotman_renner_spatia1_idx` (`lotman_renner_spatial_semantics_id`) USING BTREE; 
ALTER TABLE `FIPOP`.`spatial_semantics_type_actor_person` DROP INDEX `fk_spatial_semantics_type_person_annotation1_idx`, ADD INDEX `fk_spatial_semantics_type_actor_person_annotation1_idx` (`annotation_id`) USING BTREE;  
ALTER TABLE `FIPOP`.`spatial_semantics_type_actor_person` DROP INDEX `fk_spatial_semantics_type_person_actor1_idx`, ADD INDEX `fk_spatial_semantics_type_actor_person_actor1_idx` (`actor_id`) USING BTREE; 
ALTER TABLE `FIPOP`.`spatial_semantics_type_actor_person` DROP INDEX `fk_spatial_semantics_type_person_level_of_concrete_action1_idx`, ADD INDEX `fk_spatial_semantics_type_actor_person_level_of_concrete_a1_idx` (`level_of_concrete_action_id`) USING BTREE; 

ALTER TABLE `FIPOP`.`spatial_semantics_type_person_translation` RENAME TO `FIPOP`.`spatial_semantics_type_actor_person_translation`;
ALTER TABLE `FIPOP`.`spatial_semantics_type_actor_person_translation` DROP FOREIGN KEY `fk_spatial_semantics_type_person_translation_spatial_semantics1`; 
ALTER TABLE `FIPOP`.`spatial_semantics_type_actor_person_translation` DROP FOREIGN KEY `fk_spatial_semantics_type_person_translation_language1`; 
ALTER TABLE `FIPOP`.`spatial_semantics_type_actor_person_translation` CHANGE `spatial_semantics_type_person_id` `spatial_semantics_type_actor_person_id` INT(11) NOT NULL;
ALTER TABLE `FIPOP`.`spatial_semantics_type_actor_person_translation` ADD CONSTRAINT `fk_spatial_semantics_type_actor_person_translation_spatial_sem1` FOREIGN KEY (`spatial_semantics_type_actor_person_id`) REFERENCES `FIPOP`.`spatial_semantics_type_actor_person`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`spatial_semantics_type_actor_person_translation` ADD CONSTRAINT `fk_spatial_semantics_type_actor_person_translation_language1` FOREIGN KEY (`language_id`) REFERENCES `FIPOP`.`language`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`spatial_semantics_type_actor_person_translation` DROP INDEX `fk_spatial_semantics_type_person_translation_spatial_seman1_idx`, ADD INDEX `fk_spatial_semantics_type_actor_person_translation_spatial1_idx` (`spatial_semantics_type_actor_person_id`) USING BTREE; 
ALTER TABLE `FIPOP`.`spatial_semantics_type_actor_person_translation` DROP INDEX `fk_spatial_semantics_type_person_translation_language1_idx`, ADD INDEX `fk_spatial_semantics_type_actor_person_translation_language1_idx` (`language_id`) USING BTREE; 

DROP TABLE `FIPOP`.`academic_title`; 

DROP TABLE `FIPOP`.`actor_has_actor_type`;

START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`actor_type` (`id`) VALUES (1);
INSERT INTO `FIPOP`.`actor_type` (`id`) VALUES (2);
COMMIT;

START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`actor_type_translation` (`id`, `actor_type_id`, `language_id`, `type`) VALUES (1, 1, 1, 'person');
INSERT INTO `FIPOP`.`actor_type_translation` (`id`, `actor_type_id`, `language_id`, `type`) VALUES (2, 2, 1, 'collective');
COMMIT;

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
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (80, 'collectiveCreated');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (81, 'collectiveEdited');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (82, 'collectiveDeleted');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (83, 'actorNameCreated');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (84, 'actorNameEdited');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (85, 'actorNameDeleted');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (86, 'addressCreated');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (87, 'addressEdited');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (88, 'addressDeleted');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (89, 'emailCreated');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (90, 'emailEdited');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (91, 'emailDeleted');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (92, 'phoneNumberCreated');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (93, 'phoneNumberEdited');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (94, 'phoneNumberDeleted');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (95, 'personCreated');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (96, 'personEdited');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (97, 'personDeleted');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (98, 'citizenshipCreated');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (99, 'citizenshipEdited');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (100, 'citizenshipDeleted');
COMMIT;
