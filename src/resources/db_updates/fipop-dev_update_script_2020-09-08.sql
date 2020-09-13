ALTER TABLE `publication` MODIFY COLUMN `slug` varchar(512) UNIQUE NOT NULL DEFAULT '', MODIFY COLUMN `media_collection_id` int(11) DEFAULT NULL, MODIFY COLUMN  `medium_id` int(11) DEFAULT NULL, MODIFY COLUMN  `access` varchar(64) NOT NULL DEFAULT 'public', ADD COLUMN `settings` text DEFAULT NULL;

