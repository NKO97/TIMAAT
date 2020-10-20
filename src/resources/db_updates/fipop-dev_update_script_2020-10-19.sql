ALTER TABLE `FIPOP`.`media_collection_has_tag` DROP FOREIGN KEY `fk_media_collection_has_tag_media_collection1`;
ALTER TABLE `FIPOP`.`media_collection_has_tag` ADD CONSTRAINT `fk_media_collection_has_tag_media_collection1` FOREIGN KEY (`media_collection_id`) REFERENCES `FIPOP`.`media_collection` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`media_collection_has_tag` DROP FOREIGN KEY `fk_media_collection_has_tag_tag1`;
ALTER TABLE `FIPOP`.`media_collection_has_tag` ADD CONSTRAINT `fk_media_collection_has_tag_tag1` FOREIGN KEY (`tag_id`) REFERENCES `FIPOP`.`tag` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `FIPOP`.`medium_has_tag` DROP FOREIGN KEY `fk_medium_has_tag_medium1`;
ALTER TABLE `FIPOP`.`medium_has_tag` ADD CONSTRAINT `fk_medium_has_tag_medium1` FOREIGN KEY (`medium_id`) REFERENCES `FIPOP`.`medium` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`medium_has_tag` DROP FOREIGN KEY `fk_medium_has_tag_tag1`;
ALTER TABLE `FIPOP`.`medium_has_tag` ADD CONSTRAINT `fk_medium_has_tag_tag1` FOREIGN KEY (`tag_id`) REFERENCES `FIPOP`.`tag` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `FIPOP`.`work_has_tag` DROP FOREIGN KEY `fk_work_has_tag_work1`;
ALTER TABLE `FIPOP`.`work_has_tag` ADD CONSTRAINT `fk_work_has_tag_work1` FOREIGN KEY (`work_id`) REFERENCES `FIPOP`.`work` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`work_has_tag` DROP FOREIGN KEY `fk_work_has_tag_tag1`;
ALTER TABLE `FIPOP`.`work_has_tag` ADD CONSTRAINT `fk_work_has_tag_tag1` FOREIGN KEY (`tag_id`) REFERENCES `FIPOP`.`tag` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
