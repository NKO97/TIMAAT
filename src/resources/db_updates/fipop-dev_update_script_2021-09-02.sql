ALTER TABLE `FIPOP`.`analysis_method_type` ADD `layer_visual` TINYINT(1) NULL;
ALTER TABLE `FIPOP`.`analysis_method_type` ADD `layer_audio` TINYINT(1) NULL;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`analysis_method_type`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '1' WHERE `analysis_method_type`.`id` = 1;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 7;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 8;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 9;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 10;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 11;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 12;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 13;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 14;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 15;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 16;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 17;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '1' WHERE `analysis_method_type`.`id` = 20;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '0', `layer_audio` = '1' WHERE `analysis_method_type`.`id` = 21;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '0', `layer_audio` = '1' WHERE `analysis_method_type`.`id` = 22;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '0', `layer_audio` = '1' WHERE `analysis_method_type`.`id` = 23;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '0', `layer_audio` = '1' WHERE `analysis_method_type`.`id` = 24;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 25;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 26;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 27;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 28;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 29;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 30;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 31;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 32;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 33;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 34;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 35;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 36;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 37;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 38;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 39;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 40;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 41;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 42;
UPDATE `FIPOP`.`analysis_method_type` SET `layer_visual` = '1', `layer_audio` = '0' WHERE `analysis_method_type`.`id` = 43;

COMMIT;
