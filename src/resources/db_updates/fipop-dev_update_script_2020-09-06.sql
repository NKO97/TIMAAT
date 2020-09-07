CREATE TABLE `publication` (
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

