ALTER TABLE `FIPOP`.`annotation` DROP INDEX `fk_annotation_uuid1_idx`;
ALTER TABLE `FIPOP`.`annotation` DROP INDEX `fk_annotation_iri1_idx`;
ALTER TABLE `FIPOP`.`annotation` DROP FOREIGN KEY `fk_annotation_iri1`;
ALTER TABLE `FIPOP`.`annotation` DROP FOREIGN KEY `fk_annotation_uuid1`;

DROP TABLE `FIPOP`.`iri`;
DROP TABLE `FIPOP`.`uuid`;

ALTER TABLE `FIPOP`.`annotation` DROP `iri.id`;
ALTER TABLE `FIPOP`.`annotation` CHANGE `uuid_id` `uuid` VARCHAR(36) NULL DEFAULT NULL;
UPDATE `FIPOP`.`annotation` SET `uuid` = NULL;

ALTER TABLE `FIPOP`.`medium_analysis_list` ADD `uuid` VARCHAR(36) NULL DEFAULT NULL AFTER `medium_id`;

ALTER TABLE `FIPOP`.`publication` DROP FOREIGN KEY `fk_medium_id`;
ALTER TABLE `FIPOP`.`publication` DROP FOREIGN KEY `fk_media_collection_id1`;
ALTER TABLE `FIPOP`.`publication` DROP INDEX `fk_medium_id`;
ALTER TABLE `FIPOP`.`publication` DROP INDEX `fk_media_collection_id1`;
ALTER TABLE `FIPOP`.`publication` DROP `medium_id`;
ALTER TABLE `FIPOP`.`publication` DROP `media_collection_id`;

TRUNCATE TABLE `FIPOP`.`publication`;

ALTER TABLE `FIPOP`.`publication` ADD `media_collection_analysis_list_id` INT NULL AFTER `owner_user_account_id`;
ALTER TABLE `FIPOP`.`publication` ADD `medium_analysis_list_id` INT NULL AFTER `media_collection_analysis_list_id`;
ALTER TABLE `FIPOP`.`publication` ADD `work_analysis_list_id` INT NULL AFTER `medium_analysis_list_id`;

ALTER TABLE `FIPOP`.`publication` ADD CONSTRAINT `fk_publication_media_collection_analysis_list1` FOREIGN KEY (`media_collection_analysis_list_id`) REFERENCES `FIPOP`.`media_collection_analysis_list` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`publication` ADD CONSTRAINT `fk_publication_medium_analysis_list1` FOREIGN KEY (`medium_analysis_list_id`) REFERENCES `FIPOP`.`medium_analysis_list` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`publication` ADD CONSTRAINT `fk_publication_work_analysis_list1` FOREIGN KEY (`work_analysis_list_id`) REFERENCES `FIPOP`.`work_analysis_list` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

CREATE INDEX `fk_publication_media_collection_analysis_list1_idx` ON `FIPOP`.`publication` (`media_collection_analysis_list_id` ASC);
CREATE INDEX `fk_publication_medium_analysis_list1_idx` ON `FIPOP`.`publication` (`medium_analysis_list_id` ASC);
CREATE INDEX `fk_publication_work_analysis_list1_idx` ON `FIPOP`.`publication` (`work_analysis_list_id` ASC);
