ALTER TABLE `FIPOP`.`media_collection` CHANGE `note` `remark` VARCHAR(4094) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL;

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

CREATE TABLE IF NOT EXISTS `FIPOP`.`publication` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `owner_user_account_id` int(11) DEFAULT NULL,
  `slug` varchar(4096) NOT NULL DEFAULT '',
  `title` varchar(4096) NOT NULL DEFAULT '',
  `media_collection_id` int(11) NOT NULL,
  `medium_id` int(11) NOT NULL,
  `access` varchar(64) NOT NULL DEFAULT '',
  `credentials` varchar(2048) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `fk_user_account_owner1` (`owner_user_account_id`),
  KEY `fk_media_collection_id1` (`media_collection_id`),
  KEY `fk_medium_id` (`medium_id`),
  CONSTRAINT `fk_media_collection_id1` FOREIGN KEY (`media_collection_id`) REFERENCES `media_collection` (`id`),
  CONSTRAINT `fk_medium_id` FOREIGN KEY (`medium_id`) REFERENCES `medium` (`id`),
  CONSTRAINT `fk_user_account_owner1` FOREIGN KEY (`owner_user_account_id`) REFERENCES `user_account` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

ALTER TABLE `FIPOP`.`publication` MODIFY COLUMN `slug` varchar(512) UNIQUE NOT NULL DEFAULT '', MODIFY COLUMN `media_collection_id` int(11) DEFAULT NULL, MODIFY COLUMN  `medium_id` int(11) DEFAULT NULL, MODIFY COLUMN  `access` varchar(64) NOT NULL DEFAULT 'public', ADD COLUMN `settings` text DEFAULT NULL;
