ALTER TABLE `FIPOP`.`music` ADD `music_text_setting_element_type_id` INT NULL AFTER `tempo_marking_id`;
ALTER TABLE `FIPOP`.`music` ADD CONSTRAINT `fk_music_music_text_setting_element_type1` FOREIGN KEY (`music_text_setting_element_type_id`) REFERENCES `music_text_setting_element_type`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX `fk_music_music_text_setting_element_type1_idx` ON `FIPOP`.`music` (`music_text_setting_element_type_id` ASC);

ALTER TABLE `FIPOP`.`music` DROP INDEX `fk_music_change_in_dynamics1_idx`;
ALTER TABLE `FIPOP`.`music` DROP FOREIGN KEY `fk_music_change_in_dynamics1`;
ALTER TABLE `FIPOP`.`music` DROP `change_in_dynamics_id`;