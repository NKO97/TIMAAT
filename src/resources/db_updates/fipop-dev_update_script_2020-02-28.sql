START TRANSACTION;
USE `FIPOP`;

UPDATE `media_type_translation` SET `type` = 'audio' WHERE `media_type_translation`.`id` = 1; 
UPDATE `media_type_translation` SET `type` = 'document' WHERE `media_type_translation`.`id` = 2; 
UPDATE `media_type_translation` SET `type` = 'image' WHERE `media_type_translation`.`id` = 3; 
UPDATE `media_type_translation` SET `type` = 'software' WHERE `media_type_translation`.`id` = 4; 
UPDATE `media_type_translation` SET `type` = 'text' WHERE `media_type_translation`.`id` = 5; 
UPDATE `media_type_translation` SET `type` = 'video' WHERE `media_type_translation`.`id` = 6; 
UPDATE `media_type_translation` SET `type` = 'videogame' WHERE `media_type_translation`.`id` = 7; 

COMMIT;
