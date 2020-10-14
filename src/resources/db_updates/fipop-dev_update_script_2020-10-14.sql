ALTER TABLE `FIPOP`.`analysis_method` AUTO_INCREMENT=1000;

ALTER TABLE `FIPOP`.`actor_has_medium_image` DROP FOREIGN KEY `fk_actor_has_medium_image_actor1`;
ALTER TABLE `FIPOP`.`actor_has_medium_image` ADD CONSTRAINT `fk_actor_has_medium_image_actor1` FOREIGN KEY (`actor_id`) REFERENCES `FIPOP`.`actor` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`actor_has_medium_image` DROP FOREIGN KEY `fk_actor_has_medium_image_medium_image1`;
ALTER TABLE `FIPOP`.`actor_has_medium_image` ADD CONSTRAINT `fk_actor_has_medium_image_medium_image1` FOREIGN KEY (`medium_image_medium_id`) REFERENCES `FIPOP`.`medium_image` (`medium_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `FIPOP`.`analysis_segment` DROP FOREIGN KEY `fk_analysis_segment_analysis_list1`;
ALTER TABLE `FIPOP`.`analysis_segment` ADD CONSTRAINT `fk_analysis_segment_analysis_list1` FOREIGN KEY (`analysis_list_id`) REFERENCES `FIPOP`.`medium_analysis_list` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `FIPOP`.`annotation` DROP FOREIGN KEY `fk_annotation_medium_analysis_list1`;
ALTER TABLE `FIPOP`.`annotation` ADD CONSTRAINT `fk_annotation_medium_analysis_list1` FOREIGN KEY (`medium_analysis_list_id`) REFERENCES `FIPOP`.`medium_analysis_list` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `FIPOP`.`annotation_has_actor` DROP FOREIGN KEY `fk_annotation_has_actor_annotation1`;
ALTER TABLE `FIPOP`.`annotation_has_actor` ADD CONSTRAINT `fk_annotation_has_actor_annotation1` FOREIGN KEY (`annotation_id`) REFERENCES `FIPOP`.`annotation` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`annotation_has_actor` DROP FOREIGN KEY IF EXISTS `fk_annotation_has_actor_actorr1`;
ALTER TABLE `FIPOP`.`annotation_has_actor` DROP FOREIGN KEY IF EXISTS `fk_annotation_has_actor_actor1`;
ALTER TABLE `FIPOP`.`annotation_has_actor` ADD CONSTRAINT `fk_annotation_has_actor_actor1` FOREIGN KEY (`actor_id`) REFERENCES `FIPOP`.`actor` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `FIPOP`.`annotation_has_annotation` DROP FOREIGN KEY `fk_annotation_has_annotation_annotation1`;
ALTER TABLE `FIPOP`.`annotation_has_annotation` ADD CONSTRAINT `fk_annotation_has_annotation_annotation1` FOREIGN KEY (`source_annotation_id`) REFERENCES `FIPOP`.`annotation` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`annotation_has_annotation` DROP FOREIGN KEY `fk_annotation_has_annotation_annotation2`;
ALTER TABLE `FIPOP`.`annotation_has_annotation` ADD CONSTRAINT `fk_annotation_has_annotation_annotation2` FOREIGN KEY (`target_annotation_id`) REFERENCES `FIPOP`.`annotation` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `FIPOP`.`annotation_has_category` DROP FOREIGN KEY `fk_annotation_has_category_annotation1`;
ALTER TABLE `FIPOP`.`annotation_has_category` ADD CONSTRAINT `fk_annotation_has_category_annotation1` FOREIGN KEY (`annotation_id`) REFERENCES `FIPOP`.`annotation` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`annotation_has_category` DROP FOREIGN KEY `fk_annotation_has_category_category1`;
ALTER TABLE `FIPOP`.`annotation_has_category` ADD CONSTRAINT `fk_annotation_has_category_category1` FOREIGN KEY (`category_id`) REFERENCES `FIPOP`.`category` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `FIPOP`.`annotation_has_event` DROP FOREIGN KEY `fk_annotation_has_event_annotation1`;
ALTER TABLE `FIPOP`.`annotation_has_event` ADD CONSTRAINT `fk_annotation_has_event_annotation1` FOREIGN KEY (`annotation_id`) REFERENCES `FIPOP`.`annotation` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`annotation_has_event` DROP FOREIGN KEY `fk_annotation_has_event_event1`;
ALTER TABLE `FIPOP`.`annotation_has_event` ADD CONSTRAINT `fk_annotation_has_event_event1` FOREIGN KEY (`event_id`) REFERENCES `FIPOP`.`event` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `FIPOP`.`annotation_has_iconclass_category` DROP FOREIGN KEY `fk_annotation_has_iconclass_category_annotation1`;
ALTER TABLE `FIPOP`.`annotation_has_iconclass_category` ADD CONSTRAINT `fk_annotation_has_iconclass_category_annotation1` FOREIGN KEY (`annotation_id`) REFERENCES `FIPOP`.`annotation` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`annotation_has_iconclass_category` DROP FOREIGN KEY `fk_annotation_has_iconclass_category_iconclass_category1`;
ALTER TABLE `FIPOP`.`annotation_has_iconclass_category` ADD CONSTRAINT `fk_annotation_has_iconclass_category_iconclass_category1` FOREIGN KEY (`iconclass_category_id`) REFERENCES `FIPOP`.`iconclass_category` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `FIPOP`.`annotation_has_location` DROP FOREIGN KEY `fk_annotation_has_location_annotation1`;
ALTER TABLE `FIPOP`.`annotation_has_location` ADD CONSTRAINT `fk_annotation_has_location_annotation1` FOREIGN KEY (`annotation_id`) REFERENCES `FIPOP`.`annotation` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`annotation_has_location` DROP FOREIGN KEY `fk_annotation_has_location_location1`;
ALTER TABLE `FIPOP`.`annotation_has_location` ADD CONSTRAINT `fk_annotation_has_location_location1` FOREIGN KEY (`location_id`) REFERENCES `FIPOP`.`location` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `FIPOP`.`annotation_has_medium` DROP FOREIGN KEY `fk_annotation_has_medium_annotation1`;
ALTER TABLE `FIPOP`.`annotation_has_medium` ADD CONSTRAINT `fk_annotation_has_medium_annotation1` FOREIGN KEY (`annotation_id`) REFERENCES `FIPOP`.`annotation` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`annotation_has_medium` DROP FOREIGN KEY `fk_annotation_has_medium_medium1`;
ALTER TABLE `FIPOP`.`annotation_has_medium` ADD CONSTRAINT `fk_annotation_has_medium_medium1` FOREIGN KEY (`medium_id`) REFERENCES `FIPOP`.`medium` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `FIPOP`.`annotation_has_url` DROP FOREIGN KEY `fk_annotation_has_url_url1`;
ALTER TABLE `FIPOP`.`annotation_has_url` ADD CONSTRAINT `fk_annotation_has_url_url1` FOREIGN KEY (`url_id`) REFERENCES `FIPOP`.`url` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`annotation_has_url` DROP FOREIGN KEY `fk_annotation_has_url_annotation1`;
ALTER TABLE `FIPOP`.`annotation_has_url` ADD CONSTRAINT `fk_annotation_has_url_annotation1` FOREIGN KEY (`annotation_id`) REFERENCES `FIPOP`.`annotation` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `FIPOP`.`event_has_tag` DROP FOREIGN KEY `fk_event_has_tag_event1`;
ALTER TABLE `FIPOP`.`event_has_tag` ADD CONSTRAINT `fk_event_has_tag_event1` FOREIGN KEY (`event_id`) REFERENCES `FIPOP`.`event` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`event_has_tag` DROP FOREIGN KEY `fk_event_has_tag_tag1`;
ALTER TABLE `FIPOP`.`event_has_tag` ADD CONSTRAINT `fk_event_has_tag_tag1` FOREIGN KEY (`tag_id`) REFERENCES `FIPOP`.`tag` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `FIPOP`.`media_collection_analysis_list` DROP FOREIGN KEY `fk_media_collection_analysis_list_media_collection1`;
ALTER TABLE `FIPOP`.`media_collection_analysis_list` ADD CONSTRAINT `fk_media_collection_analysis_list_media_collection1` FOREIGN KEY (`media_collection_id`) REFERENCES `FIPOP`.`media_collection` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `FIPOP`.`media_collection_analysis_list_has_tag` DROP FOREIGN KEY `fk_media_collection_analysis_list_has_tag_media_collection_an1`;
ALTER TABLE `FIPOP`.`media_collection_analysis_list_has_tag` ADD CONSTRAINT `fk_media_collection_analysis_list_has_tag_media_collection_an1` FOREIGN KEY (`media_collection_analysis_list_id`) REFERENCES `FIPOP`.`media_collection_analysis_list` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`media_collection_analysis_list_has_tag` DROP FOREIGN KEY `fk_media_collection_analysis_list_has_tag_tag1`;
ALTER TABLE `FIPOP`.`media_collection_analysis_list_has_tag` ADD CONSTRAINT `fk_media_collection_analysis_list_has_tag_tag1` FOREIGN KEY (`tag_id`) REFERENCES `FIPOP`.`tag` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `FIPOP`.`medium_analysis_list` DROP FOREIGN KEY `fk_medium_analysis_list_medium1`;
ALTER TABLE `FIPOP`.`medium_analysis_list` ADD CONSTRAINT `fk_medium_analysis_list_medium1` FOREIGN KEY (`medium_id`) REFERENCES `FIPOP`.`medium` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`medium_analysis_list` DROP FOREIGN KEY `fk_medium_analysis_list_media_collection_analysis_list1`;
ALTER TABLE `FIPOP`.`medium_analysis_list` ADD CONSTRAINT `fk_medium_analysis_list_media_collection_analysis_list1` FOREIGN KEY (`media_collection_analysis_list_id`) REFERENCES `FIPOP`.`media_collection_analysis_list` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE `FIPOP`.`medium_analysis_list_has_tag` DROP FOREIGN KEY `fk_medium_analysis_list_has_tag_medium_analysis_list1`;
ALTER TABLE `FIPOP`.`medium_analysis_list_has_tag` ADD CONSTRAINT `fk_medium_analysis_list_has_tag_medium_analysis_list1` FOREIGN KEY (`medium_analysis_list_id`) REFERENCES `FIPOP`.`medium_analysis_list` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`medium_analysis_list_has_tag` DROP FOREIGN KEY `fk_medium_analysis_list_has_tag_tag1`;
ALTER TABLE `FIPOP`.`medium_analysis_list_has_tag` ADD CONSTRAINT `fk_medium_analysis_list_has_tag_tag1` FOREIGN KEY (`tag_id`) REFERENCES `FIPOP`.`tag` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `FIPOP`.`medium_has_language` DROP FOREIGN KEY `fk_medium_has_language_medium1`;
ALTER TABLE `FIPOP`.`medium_has_language` ADD CONSTRAINT `fk_medium_has_language_medium1` FOREIGN KEY (`medium_id`) REFERENCES `FIPOP`.`medium` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `FIPOP`.`publication` DROP FOREIGN KEY `fk_media_collection_id1`;
ALTER TABLE `FIPOP`.`publication` ADD CONSTRAINT `fk_media_collection_id1` FOREIGN KEY (`media_collection_id`) REFERENCES `media_collection`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;
ALTER TABLE `FIPOP`.`publication` DROP FOREIGN KEY `fk_medium_id`;
ALTER TABLE `FIPOP`.`publication` ADD CONSTRAINT `fk_medium_id` FOREIGN KEY (`medium_id`) REFERENCES `medium`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

ALTER TABLE `FIPOP`.`selector_svg` DROP FOREIGN KEY `fk_selector_svg_annotation1`;
ALTER TABLE `FIPOP`.`selector_svg` ADD CONSTRAINT `fk_selector_svg_annotation1` FOREIGN KEY (`annotation_id`) REFERENCES `FIPOP`.`annotation` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `FIPOP`.`work_analysis_list` DROP FOREIGN KEY `fk_work_analysis_list_work1`;
ALTER TABLE `FIPOP`.`work_analysis_list` ADD CONSTRAINT `fk_work_analysis_list_work1` FOREIGN KEY (`work_id`) REFERENCES `FIPOP`.`work` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `FIPOP`.`work_analysis_list_has_tag` DROP FOREIGN KEY `fk_work_analysis_list_has_tag_work_analysis_list1`;
ALTER TABLE `FIPOP`.`work_analysis_list_has_tag` ADD CONSTRAINT `fk_work_analysis_list_has_tag_work_analysis_list1` FOREIGN KEY (`work_analysis_list_id`) REFERENCES `FIPOP`.`work_analysis_list` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`work_analysis_list_has_tag` DROP FOREIGN KEY `fk_work_analysis_list_has_tag_tag1`;
ALTER TABLE `FIPOP`.`work_analysis_list_has_tag` ADD CONSTRAINT `fk_work_analysis_list_has_tag_tag1` FOREIGN KEY (`tag_id`) REFERENCES `FIPOP`.`tag` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
