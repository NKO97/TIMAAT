ALTER TABLE `FIPOP`.`media_collection` ADD `global_permission` TINYINT(2) NULL AFTER `is_systemic`;
ALTER TABLE `FIPOP`.`medium_analysis_list` ADD `global_permission` TINYINT(2) NULL AFTER `last_edited_by_user_account_id`;
ALTER TABLE `FIPOP`.`work_analysis_list` ADD `global_permission` TINYINT(2) NULL AFTER `last_edited_by_user_account_id`;
ALTER TABLE `FIPOP`.`media_collection_analysis_list` ADD `global_permission` TINYINT(2) NULL AFTER `last_edited_by_user_account_id`;