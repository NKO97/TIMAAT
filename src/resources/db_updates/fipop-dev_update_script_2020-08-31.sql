ALTER TABLE `FIPOP`.`media_collection_has_medium` DROP FOREIGN KEY `fk_media_collection_has_medium_medium1`; 
ALTER TABLE `FIPOP`.`media_collection_has_medium` ADD CONSTRAINT `fk_media_collection_has_medium_medium1` FOREIGN KEY (`medium_id`) REFERENCES `medium`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`media_collection_has_medium` DROP FOREIGN KEY `fk_media_collection_has_medium_medium_collection1`; 
ALTER TABLE `FIPOP`.`media_collection_has_medium` ADD CONSTRAINT `fk_media_collection_has_medium_medium_collection1` FOREIGN KEY (`media_collection_id`) REFERENCES `media_collection`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `FIPOP`.`media_collection_album` DROP FOREIGN KEY `fk_media_collection_album_media_collection1`; 
ALTER TABLE `FIPOP`.`media_collection_album` ADD CONSTRAINT `fk_media_collection_album_media_collection1` FOREIGN KEY (`media_collection_id`) REFERENCES `media_collection`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `FIPOP`.`media_collection_series` DROP FOREIGN KEY `fk_media_collection_series_media_collection1`; 
ALTER TABLE `FIPOP`.`media_collection_series` ADD CONSTRAINT `fk_media_collection_series_media_collection1` FOREIGN KEY (`media_collection_id`) REFERENCES `media_collection`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `FIPOP`.`media_collection_series` CHANGE `start_year` `started` DATE NULL DEFAULT NULL;
ALTER TABLE `FIPOP`.`media_collection_series` CHANGE `end_year` `ended` DATE NULL DEFAULT NULL;