ALTER TABLE `FIPOP`.`medium_audio` ADD `audio_post_production_id` INT NULL AFTER `audio_codec_information_id`;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
ALTER TABLE `FIPOP`.`medium_audio` ADD  CONSTRAINT `fk_medium_audio_audio_post_production1` FOREIGN KEY (`audio_post_production_id`) REFERENCES `audio_post_production`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
CREATE INDEX `fk_medium_audio_audio_post_production1_idx` ON `FIPOP`.`medium_audio` (`audio_post_production_id` ASC);

DROP TABLE IF EXISTS `FIPOP`.`nasheed_has_title`;
DROP TABLE IF EXISTS `FIPOP`.`nasheed`;

ALTER TABLE `FIPOP`.`actor_person` ADD `citizenship` VARCHAR(100) NULL AFTER `title`, ADD `place_of_birth` VARCHAR(255) NULL AFTER `citizenship`, ADD `place_of_death` VARCHAR(255) NULL AFTER `place_of_birth`;

-- -----------------------------------------------------
-- Table `FIPOP`.`music_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FIPOP`.`music_type_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_type_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `music_type_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_music_type_translation_music_type1`
    FOREIGN KEY (`music_type_id`)
    REFERENCES `FIPOP`.`music_type` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_type_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_type_translation_music_type1_idx` ON `FIPOP`.`music_type_translation` (`music_type_id` ASC);

CREATE INDEX `fk_music_type_translation_language1_idx` ON `FIPOP`.`music_type_translation` (`language_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`church_musical_key`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`church_musical_key` (
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FIPOP`.`church_musical_key_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`church_musical_key_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `church_musical_key_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_church_musical_key_translation_church_musical_key1`
    FOREIGN KEY (`church_musical_key_id`)
    REFERENCES `FIPOP`.`church_musical_key` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_church_musical_key_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_church_musical_key_translation_church_musical_key1_idx` ON `FIPOP`.`church_musical_key_translation` (`church_musical_key_id` ASC);

CREATE INDEX `fk_church_musical_key_translation_language1_idx` ON `FIPOP`.`church_musical_key_translation` (`language_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`voice_leading_pattern`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`voice_leading_pattern` (
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FIPOP`.`voice_leading_pattern_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`voice_leading_pattern_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `voice_leading_pattern_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `type` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_voice_leading_pattern_translation_voice_leading_pattern1`
    FOREIGN KEY (`voice_leading_pattern_id`)
    REFERENCES `FIPOP`.`voice_leading_pattern` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_voice_leading_pattern_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_voice_leading_pattern_translation_voice_leading_pattern1_idx` ON `FIPOP`.`voice_leading_pattern_translation` (`voice_leading_pattern_id` ASC);

CREATE INDEX `fk_voice_leading_pattern_translation_language1_idx` ON `FIPOP`.`voice_leading_pattern_translation` (`language_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`music_text_setting_element_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_text_setting_element_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FIPOP`.`music`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `music_type_id` INT NOT NULL,
  `display_title_title_id` INT NOT NULL,
  `original_title_title_id` INT NULL,
  `dynamic_marking_id` INT NULL,
  `musical_key_id` INT NULL,
  `tempo_marking_id` INT NULL,
  `music_text_setting_element_type_id` INT NULL,
  `audio_post_production_id` INT NULL,
  `created_by_user_account_id` INT NOT NULL,
  `last_edited_by_user_account_id` INT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `last_edited_at` TIMESTAMP NULL,
  `beat` VARCHAR(45) NULL,
  `melody` VARCHAR(50) NULL,
  `tempo` SMALLINT(4) NULL,
  `harmony` VARCHAR(50) NULL,
  `instrumentation` VARCHAR(1024) NULL,
  `remark` VARCHAR(1000) NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_music_dynamic_marking1`
    FOREIGN KEY (`dynamic_marking_id`)
    REFERENCES `FIPOP`.`dynamic_marking` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_audio_post_production1`
    FOREIGN KEY (`audio_post_production_id`)
    REFERENCES `FIPOP`.`audio_post_production` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_musical_key1`
    FOREIGN KEY (`musical_key_id`)
    REFERENCES `FIPOP`.`musical_key` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_music_type1`
    FOREIGN KEY (`music_type_id`)
    REFERENCES `FIPOP`.`music_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_title1`
    FOREIGN KEY (`display_title_title_id`)
    REFERENCES `FIPOP`.`title` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_title2`
    FOREIGN KEY (`original_title_title_id`)
    REFERENCES `FIPOP`.`title` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_user_account1`
    FOREIGN KEY (`created_by_user_account_id`)
    REFERENCES `FIPOP`.`user_account` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_user_account2`
    FOREIGN KEY (`last_edited_by_user_account_id`)
    REFERENCES `FIPOP`.`user_account` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_tempo_marking1`
    FOREIGN KEY (`tempo_marking_id`)
    REFERENCES `FIPOP`.`tempo_marking` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_music_text_setting_element_type1`
    FOREIGN KEY (`music_text_setting_element_type_id`)
    REFERENCES `FIPOP`.`music_text_setting_element_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_dynamic_marking1_idx` ON `FIPOP`.`music` (`dynamic_marking_id` ASC);

CREATE INDEX `fk_music_audio_post_production1_idx` ON `FIPOP`.`music` (`audio_post_production_id` ASC);

CREATE INDEX `fk_music_musical_key1_idx` ON `FIPOP`.`music` (`musical_key_id` ASC);

CREATE INDEX `fk_music_music_type1_idx` ON `FIPOP`.`music` (`music_type_id` ASC);

CREATE INDEX `fk_music_title1_idx` ON `FIPOP`.`music` (`display_title_title_id` ASC);

CREATE INDEX `fk_music_title2_idx` ON `FIPOP`.`music` (`original_title_title_id` ASC);

CREATE INDEX `fk_music_user_account1_idx` ON `FIPOP`.`music` (`created_by_user_account_id` ASC);

CREATE INDEX `fk_music_user_account2_idx` ON `FIPOP`.`music` (`last_edited_by_user_account_id` ASC);

CREATE INDEX `fk_music_tempo_marking1_idx` ON `FIPOP`.`music` (`tempo_marking_id` ASC);

CREATE INDEX `fk_music_music_text_setting_element_type1_idx` ON `FIPOP`.`music` (`music_text_setting_element_type_id` ASC);



ALTER TABLE `FIPOP`.`medium` ADD `music_id` INT NULL AFTER `work_id`;
ALTER TABLE `FIPOP`.`medium` ADD CONSTRAINT `fk_medium_music1` FOREIGN KEY (`music_id`) REFERENCES `music`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;
CREATE INDEX `fk_medium_music1_idx` ON `FIPOP`.`medium` (`music_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`music_nashid`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_nashid` (
  `music_id` INT NOT NULL,
  `jins_id` INT NULL,
  `maqam_id` INT NULL,
  PRIMARY KEY (`music_id`),
  CONSTRAINT `fk_music_nashid_music1`
    FOREIGN KEY (`music_id`)
    REFERENCES `FIPOP`.`music` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_nashid_jins1`
    FOREIGN KEY (`jins_id`)
    REFERENCES `FIPOP`.`jins` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_nashid_maqam1`
    FOREIGN KEY (`maqam_id`)
    REFERENCES `FIPOP`.`maqam` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_nashid_jins1_idx` ON `FIPOP`.`music_nashid` (`jins_id` ASC);

CREATE INDEX `fk_music_nashid_maqam1_idx` ON `FIPOP`.`music_nashid` (`maqam_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`music_church_music`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_church_music` (
  `music_id` INT NOT NULL,
  `church_musical_key_id` INT NULL,
  PRIMARY KEY (`music_id`),
  CONSTRAINT `fk_music_church_music_music1`
    FOREIGN KEY (`music_id`)
    REFERENCES `FIPOP`.`music` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_church_music_church_musical_key1`
    FOREIGN KEY (`church_musical_key_id`)
    REFERENCES `FIPOP`.`church_musical_key` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_church_music_church_musical_key1_idx` ON `FIPOP`.`music_church_music` (`church_musical_key_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`music_has_voice_leading_pattern`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_has_voice_leading_pattern` (
  `music_id` INT NOT NULL,
  `voice_leading_pattern_id` INT NOT NULL,
  PRIMARY KEY (`music_id`, `voice_leading_pattern_id`),
  CONSTRAINT `fk_music_has_voice_leading_pattern_music1`
    FOREIGN KEY (`music_id`)
    REFERENCES `FIPOP`.`music` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_has_voice_leading_pattern_voice_leading_pattern1`
    FOREIGN KEY (`voice_leading_pattern_id`)
    REFERENCES `FIPOP`.`voice_leading_pattern` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_has_voice_leading_pattern_voice_leading_pattern1_idx` ON `FIPOP`.`music_has_voice_leading_pattern` (`voice_leading_pattern_id` ASC);

CREATE INDEX `fk_music_has_voice_leading_pattern_music1_idx` ON `FIPOP`.`music_has_voice_leading_pattern` (`music_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`music_has_actor_with_role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_has_actor_with_role` (
  `music_id` INT NOT NULL,
  `actor_has_role_actor_id` INT NOT NULL,
  `actor_has_role_role_id` INT NOT NULL,
  PRIMARY KEY (`music_id`, `actor_has_role_actor_id`, `actor_has_role_role_id`),
  CONSTRAINT `fk_music_has_actor_with_role_music1`
    FOREIGN KEY (`music_id`)
    REFERENCES `FIPOP`.`music` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_has_actor_with_role_actor_has_role1`
    FOREIGN KEY (`actor_has_role_actor_id` , `actor_has_role_role_id`)
    REFERENCES `FIPOP`.`actor_has_role` (`actor_id` , `role_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_has_actor_with_role_actor_has_role1_idx` ON `FIPOP`.`music_has_actor_with_role` (`actor_has_role_actor_id` ASC, `actor_has_role_role_id` ASC);

CREATE INDEX `fk_music_has_actor_with_role_music1_idx` ON `FIPOP`.`music_has_actor_with_role` (`music_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`music_has_title`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_has_title` (
  `music_id` INT NOT NULL,
  `title_id` INT NOT NULL,
  PRIMARY KEY (`music_id`, `title_id`),
  CONSTRAINT `fk_music_has_title_music1`
    FOREIGN KEY (`music_id`)
    REFERENCES `FIPOP`.`music` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_has_title_title1`
    FOREIGN KEY (`title_id`)
    REFERENCES `FIPOP`.`title` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_has_title_title1_idx` ON `FIPOP`.`music_has_title` (`title_id` ASC);

CREATE INDEX `fk_music_has_title_music1_idx` ON `FIPOP`.`music_has_title` (`music_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`music_has_tag`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_has_tag` (
  `music_id` INT NOT NULL,
  `tag_id` INT NOT NULL,
  PRIMARY KEY (`music_id`, `tag_id`),
  CONSTRAINT `fk_music_has_tag_music1`
    FOREIGN KEY (`music_id`)
    REFERENCES `FIPOP`.`music` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_has_tag_tag1`
    FOREIGN KEY (`tag_id`)
    REFERENCES `FIPOP`.`tag` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_has_tag_tag1_idx` ON `FIPOP`.`music_has_tag` (`tag_id` ASC);

CREATE INDEX `fk_music_has_tag_music1_idx` ON `FIPOP`.`music_has_tag` (`music_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`music_has_category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_has_category` (
  `music_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  PRIMARY KEY (`music_id`, `category_id`),
  CONSTRAINT `fk_music_has_category_music1`
    FOREIGN KEY (`music_id`)
    REFERENCES `FIPOP`.`music` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_has_category_category1`
    FOREIGN KEY (`category_id`)
    REFERENCES `FIPOP`.`category` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_has_category_category1_idx` ON `FIPOP`.`music_has_category` (`category_id` ASC);

CREATE INDEX `fk_music_has_category_music1_idx` ON `FIPOP`.`music_has_category` (`music_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`music_has_category_set`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_has_category_set` (
  `music_id` INT NOT NULL,
  `category_set_id` INT NOT NULL,
  PRIMARY KEY (`music_id`, `category_set_id`),
  CONSTRAINT `fk_music_has_category_set_music1`
    FOREIGN KEY (`music_id`)
    REFERENCES `FIPOP`.`music` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_has_category_set_category_set1`
    FOREIGN KEY (`category_set_id`)
    REFERENCES `FIPOP`.`category_set` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_has_category_set_category_set1_idx` ON `FIPOP`.`music_has_category_set` (`category_set_id` ASC);

CREATE INDEX `fk_music_has_category_set_music1_idx` ON `FIPOP`.`music_has_category_set` (`music_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`music_form_element_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_form_element_type` (
  `id` INT NOT NULL,
  `color_hex` VARCHAR(6) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FIPOP`.`music_form_element_type_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_form_element_type_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `music_form_element_type_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_music_form_element_type_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_form_element_type_translation_music_form_element_type1`
    FOREIGN KEY (`music_form_element_type_id`)
    REFERENCES `FIPOP`.`music_form_element_type` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_form_element_type_translation_language1_idx` ON `FIPOP`.`music_form_element_type_translation` (`language_id` ASC);

CREATE INDEX `fk_music_form_element_type_translation_music_form_element_t_idx` ON `FIPOP`.`music_form_element_type_translation` (`music_form_element_type_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`music_form_element`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_form_element` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `music_id` INT NOT NULL,
  `music_form_element_type_id` INT NOT NULL,
  `start_time` INT(11) NOT NULL,
  `end_time` INT(11) NOT NULL,
  `repeat_last_row` TINYINT(1) NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_music_form_element_music1`
    FOREIGN KEY (`music_id`)
    REFERENCES `FIPOP`.`music` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_form_element_music_form_element_type1`
    FOREIGN KEY (`music_form_element_type_id`)
    REFERENCES `FIPOP`.`music_form_element_type` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_form_element_music1_idx` ON `FIPOP`.`music_form_element` (`music_id` ASC);

CREATE INDEX `fk_music_form_element_music_form_element_type1_idx` ON `FIPOP`.`music_form_element` (`music_form_element_type_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`music_form_element_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_form_element_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `music_form_element_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `text` TEXT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_music_form_element_translation_music_form_element1`
    FOREIGN KEY (`music_form_element_id`)
    REFERENCES `FIPOP`.`music_form_element` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_form_element_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_form_element_translation_music_form_element1_idx` ON `FIPOP`.`music_form_element_translation` (`music_form_element_id` ASC);

CREATE INDEX `fk_music_form_element_translation_language1_idx` ON `FIPOP`.`music_form_element_translation` (`language_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`music_change_in_tempo_element`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_change_in_tempo_element` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `music_id` INT NOT NULL,
  `change_in_tempo_id` INT NOT NULL,
  `start_time` INT(11) NOT NULL,
  `end_time` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_music_change_in_tempo_element_music1`
    FOREIGN KEY (`music_id`)
    REFERENCES `FIPOP`.`music` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_change_in_tempo_element_change_in_tempo1`
    FOREIGN KEY (`change_in_tempo_id`)
    REFERENCES `FIPOP`.`change_in_tempo` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_change_in_tempo_element_music1_idx` ON `FIPOP`.`music_change_in_tempo_element` (`music_id` ASC);

CREATE INDEX `fk_music_change_in_tempo_element_change_in_tempo1_idx` ON `FIPOP`.`music_change_in_tempo_element` (`change_in_tempo_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`medium_has_music`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`medium_has_music` (
  `medium_id` INT NOT NULL,
  `music_id` INT NOT NULL,
  PRIMARY KEY (`medium_id`, `music_id`),
  CONSTRAINT `fk_medium_has_music_medium1`
    FOREIGN KEY (`medium_id`)
    REFERENCES `FIPOP`.`medium` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_medium_has_music_music1`
    FOREIGN KEY (`music_id`)
    REFERENCES `FIPOP`.`music` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_medium_has_music_music1_idx` ON `FIPOP`.`medium_has_music` (`music_id` ASC);

CREATE INDEX `fk_medium_has_music_medium1_idx` ON `FIPOP`.`medium_has_music` (`medium_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`medium_has_music_detail`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`medium_has_music_detail` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `medium_has_music_medium_id` INT NOT NULL,
  `medium_has_music_music_id` INT NOT NULL,
  `start_time` INT(11) NULL,
  `end_time` INT(11) NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_medium_has_music_detail_medium_has_music1`
    FOREIGN KEY (`medium_has_music_medium_id` , `medium_has_music_music_id`)
    REFERENCES `FIPOP`.`medium_has_music` (`medium_id` , `music_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_medium_has_music_detail_medium_has_music1_idx` ON `FIPOP`.`medium_has_music_detail` (`medium_has_music_medium_id` ASC, `medium_has_music_music_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`music_articulation_element`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_articulation_element` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `music_id` INT NOT NULL,
  `articulation_id` INT NOT NULL,
  `start_time` INT(11) NOT NULL,
  `end_time` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_music_articulation_element_music1`
    FOREIGN KEY (`music_id`)
    REFERENCES `FIPOP`.`music` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_articulation_element_articulation1`
    FOREIGN KEY (`articulation_id`)
    REFERENCES `FIPOP`.`articulation` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_articulation_element_music1_idx` ON `FIPOP`.`music_articulation_element` (`music_id` ASC);

CREATE INDEX `fk_music_articulation_element_articulation1_idx` ON `FIPOP`.`music_articulation_element` (`articulation_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`music_text_setting_element`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_text_setting_element` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `music_id` INT NOT NULL,
  `music_text_setting_element_type_id` INT NOT NULL,
  `start_time` INT(11) NOT NULL,
  `end_time` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_music_text_setting_element_music1`
    FOREIGN KEY (`music_id`)
    REFERENCES `FIPOP`.`music` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_text_setting_element_music_text_setting_element_type1`
    FOREIGN KEY (`music_text_setting_element_type_id`)
    REFERENCES `FIPOP`.`music_text_setting_element_type` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_text_setting_element_music1_idx` ON `FIPOP`.`music_text_setting_element` (`music_id` ASC);

CREATE INDEX `fk_music_text_setting_element_music_text_setting_element_ty_idx` ON `FIPOP`.`music_text_setting_element` (`music_text_setting_element_type_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`music_text_setting_element_type_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_text_setting_element_type_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `music_text_setting_element_type_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_music_text_setting_element_type_translation_music_text_set1`
    FOREIGN KEY (`music_text_setting_element_type_id`)
    REFERENCES `FIPOP`.`music_text_setting_element_type` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_text_setting_element_type_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_text_setting_element_type_translation_music_text_s_idx` ON `FIPOP`.`music_text_setting_element_type_translation` (`music_text_setting_element_type_id` ASC);

CREATE INDEX `fk_music_text_setting_element_type_translation_language1_idx` ON `FIPOP`.`music_text_setting_element_type_translation` (`language_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`music_dynamics_element_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_dynamics_element_type` (
  `id` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FIPOP`.`music_dynamics_element`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_dynamics_element` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `music_id` INT NOT NULL,
  `music_dynamics_element_type_id` INT NOT NULL,
  `start_time` INT(11) NOT NULL,
  `end_time` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_music_dynamics_element_music1`
    FOREIGN KEY (`music_id`)
    REFERENCES `FIPOP`.`music` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_dynamics_element_music_dynamics_element_type1`
    FOREIGN KEY (`music_dynamics_element_type_id`)
    REFERENCES `FIPOP`.`music_dynamics_element_type` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_dynamics_element_music1_idx` ON `FIPOP`.`music_dynamics_element` (`music_id` ASC);

CREATE INDEX `fk_music_dynamics_element_music_dynamics_element_type1_idx` ON `FIPOP`.`music_dynamics_element` (`music_dynamics_element_type_id` ASC);


-- -----------------------------------------------------
-- Table `FIPOP`.`music_dynamics_element_type_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music_dynamics_element_type_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `music_dynamics_element_type_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_music_dynamics_element_type_translation_music_dynamics_ele1`
    FOREIGN KEY (`music_dynamics_element_type_id`)
    REFERENCES `FIPOP`.`music_dynamics_element_type` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_dynamics_element_type_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_dynamics_element_type_translation_music_dynamics_e_idx` ON `FIPOP`.`music_dynamics_element_type_translation` (`music_dynamics_element_type_id` ASC);

CREATE INDEX `fk_music_dynamics_element_type_translation_language1_idx` ON `FIPOP`.`music_dynamics_element_type_translation` (`language_id` ASC);


-- -----------------------------------------------------
-- Data for table `FIPOP`.`user_password`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`user_password` (`id`, `user_password_hash_type_id`, `salt`, `key_stretching_iterations`, `stretched_hash_encrypted`) VALUES (19, 1, 'salzigessalt', 8, 'c75f73f1d4b83f6eb15120ac5c308a47557244efc136d2af1945400759fa2fb0');

COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`user_account`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
UPDATE `FIPOP`.`user_account` SET `user_account_status` = 'suspended' WHERE `user_account`.`id` = 12;
INSERT INTO `FIPOP`.`user_account` (`id`, `user_password_id`, `user_account_status`, `account_name`, `display_name`, `created_at`, `recovery_email_encrypted`, `content_access_rights`, `user_settings_web_interface`) VALUES (18, 19, 'active', 'mz', 'Marlene Ziegelmayer', '2022-01-25 17:57:00', 'foo@bar.de', NULL, NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`music_form_element_type`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`music_form_element_type` (`id`, `color_hex`) VALUES (1, '5c85d6');
INSERT INTO `FIPOP`.`music_form_element_type` (`id`, `color_hex`) VALUES (2, 'e6e600');
INSERT INTO `FIPOP`.`music_form_element_type` (`id`, `color_hex`) VALUES (3, '39ac39');
INSERT INTO `FIPOP`.`music_form_element_type` (`id`, `color_hex`) VALUES (4, '5c85d6');
INSERT INTO `FIPOP`.`music_form_element_type` (`id`, `color_hex`) VALUES (5, '5c85d6');
INSERT INTO `FIPOP`.`music_form_element_type` (`id`, `color_hex`) VALUES (6, '5c85d6');
INSERT INTO `FIPOP`.`music_form_element_type` (`id`, `color_hex`) VALUES (7, '800000');
INSERT INTO `FIPOP`.`music_form_element_type` (`id`, `color_hex`) VALUES (8, 'a6a6a6');

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`music_form_element_type_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (1, 1, 1, 'Intro');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (2, 2, 1, 'Verse');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (3, 3, 1, 'Chorus');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (4, 4, 1, 'Outro');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (5, 5, 1, 'Bridge');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (6, 6, 1, 'Interlude');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (7, 7, 1, 'Instr. Solo');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (8, 8, 1, 'Tacet');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (9, 1, 2, 'Intro');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (10, 2, 2, 'Verse');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (11, 3, 2, 'Chorus');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (12, 4, 2, 'Outro');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (13, 5, 2, 'Bridge');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (14, 6, 2, 'Interlude');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (15, 7, 2, 'Instr. Solo');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (16, 8, 2, 'Tacet');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (17, 1, 3, 'Intro');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (18, 2, 3, 'Strophe');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (19, 3, 3, 'Refrain');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (20, 4, 3, 'Outro');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (21, 5, 3, 'Bridge');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (22, 6, 3, 'Interlude');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (23, 7, 3, 'Instr. Solo');
INSERT INTO `FIPOP`.`music_form_element_type_translation` (`id`, `music_form_element_type_id`, `language_id`, `type`) VALUES (24, 8, 3, 'Tacet');

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`music_dynamics_element_type`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`music_dynamics_element_type` (`id`) VALUES (1);
INSERT INTO `FIPOP`.`music_dynamics_element_type` (`id`) VALUES (2);
INSERT INTO `FIPOP`.`music_dynamics_element_type` (`id`) VALUES (3);
INSERT INTO `FIPOP`.`music_dynamics_element_type` (`id`) VALUES (4);
INSERT INTO `FIPOP`.`music_dynamics_element_type` (`id`) VALUES (5);
INSERT INTO `FIPOP`.`music_dynamics_element_type` (`id`) VALUES (6);
INSERT INTO `FIPOP`.`music_dynamics_element_type` (`id`) VALUES (7);
INSERT INTO `FIPOP`.`music_dynamics_element_type` (`id`) VALUES (8);
INSERT INTO `FIPOP`.`music_dynamics_element_type` (`id`) VALUES (9);
INSERT INTO `FIPOP`.`music_dynamics_element_type` (`id`) VALUES (10);
INSERT INTO `FIPOP`.`music_dynamics_element_type` (`id`) VALUES (11);
INSERT INTO `FIPOP`.`music_dynamics_element_type` (`id`) VALUES (12);
INSERT INTO `FIPOP`.`music_dynamics_element_type` (`id`) VALUES (13);
INSERT INTO `FIPOP`.`music_dynamics_element_type` (`id`) VALUES (14);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`music_dynamics_element_type_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`music_dynamics_element_type_translation` (`id`, `music_dynamics_element_type_id`, `language_id`, `type`) VALUES (1, 1, 1, 'fortississimo');
INSERT INTO `FIPOP`.`music_dynamics_element_type_translation` (`id`, `music_dynamics_element_type_id`, `language_id`, `type`) VALUES (2, 2, 1, 'fortissimo');
INSERT INTO `FIPOP`.`music_dynamics_element_type_translation` (`id`, `music_dynamics_element_type_id`, `language_id`, `type`) VALUES (3, 3, 1, 'forte');
INSERT INTO `FIPOP`.`music_dynamics_element_type_translation` (`id`, `music_dynamics_element_type_id`, `language_id`, `type`) VALUES (4, 4, 1, 'mezzo-forte');
INSERT INTO `FIPOP`.`music_dynamics_element_type_translation` (`id`, `music_dynamics_element_type_id`, `language_id`, `type`) VALUES (5, 5, 1, 'mezzo-piano');
INSERT INTO `FIPOP`.`music_dynamics_element_type_translation` (`id`, `music_dynamics_element_type_id`, `language_id`, `type`) VALUES (6, 6, 1, 'piano');
INSERT INTO `FIPOP`.`music_dynamics_element_type_translation` (`id`, `music_dynamics_element_type_id`, `language_id`, `type`) VALUES (7, 7, 1, 'panissimo');
INSERT INTO `FIPOP`.`music_dynamics_element_type_translation` (`id`, `music_dynamics_element_type_id`, `language_id`, `type`) VALUES (8, 8, 1, 'pianississimo');
INSERT INTO `FIPOP`.`music_dynamics_element_type_translation` (`id`, `music_dynamics_element_type_id`, `language_id`, `type`) VALUES (9, 9, 1, 'crescendo');
INSERT INTO `FIPOP`.`music_dynamics_element_type_translation` (`id`, `music_dynamics_element_type_id`, `language_id`, `type`) VALUES (10, 10, 1, 'decrescendo');
INSERT INTO `FIPOP`.`music_dynamics_element_type_translation` (`id`, `music_dynamics_element_type_id`, `language_id`, `type`) VALUES (11, 11, 1, 'diminuendo');
INSERT INTO `FIPOP`.`music_dynamics_element_type_translation` (`id`, `music_dynamics_element_type_id`, `language_id`, `type`) VALUES (12, 12, 1, 'sforzando');
INSERT INTO `FIPOP`.`music_dynamics_element_type_translation` (`id`, `music_dynamics_element_type_id`, `language_id`, `type`) VALUES (13, 13, 1, 'fortepiano');
INSERT INTO `FIPOP`.`music_dynamics_element_type_translation` (`id`, `music_dynamics_element_type_id`, `language_id`, `type`) VALUES (14, 14, 1, 'niente');

COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`music_text_setting_element_type`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`music_text_setting_element_type` (`id`) VALUES (1);
INSERT INTO `FIPOP`.`music_text_setting_element_type` (`id`) VALUES (2);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`music_text_setting_element_type_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`music_text_setting_element_type_translation` (`id`, `music_text_setting_element_type_id`, `language_id`, `type`) VALUES (1, 1, 1, 'melismatic');
INSERT INTO `FIPOP`.`music_text_setting_element_type_translation` (`id`, `music_text_setting_element_type_id`, `language_id`, `type`) VALUES (2, 2, 1, 'syllabic');
INSERT INTO `FIPOP`.`music_text_setting_element_type_translation` (`id`, `music_text_setting_element_type_id`, `language_id`, `type`) VALUES (3, 1, 2, 'melismatic');
INSERT INTO `FIPOP`.`music_text_setting_element_type_translation` (`id`, `music_text_setting_element_type_id`, `language_id`, `type`) VALUES (4, 2, 2, 'syllabic');
INSERT INTO `FIPOP`.`music_text_setting_element_type_translation` (`id`, `music_text_setting_element_type_id`, `language_id`, `type`) VALUES (5, 1, 3, 'melismatisch');
INSERT INTO `FIPOP`.`music_text_setting_element_type_translation` (`id`, `music_text_setting_element_type_id`, `language_id`, `type`) VALUES (6, 2, 3, 'syllabisch');

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`music_type`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`music_type` (`id`) VALUES (1);
INSERT INTO `FIPOP`.`music_type` (`id`) VALUES (2);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`music_type_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`music_type_translation` (`id`, `music_type_id`, `language_id`, `type`) VALUES (1, 1, 1, 'nashid');
INSERT INTO `FIPOP`.`music_type_translation` (`id`, `music_type_id`, `language_id`, `type`) VALUES (2, 2, 1, 'churchMusic');

COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`user_log_event_type`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (125, 'musicCreated');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (126, 'musicEdited');
INSERT INTO `FIPOP`.`user_log_event_type` (`id`, `type`) VALUES (127, 'musicDeleted');

COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`articulation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`articulation` (`id`) VALUES (1);
INSERT INTO `FIPOP`.`articulation` (`id`) VALUES (2);
INSERT INTO `FIPOP`.`articulation` (`id`) VALUES (3);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`articulation_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`articulation_translation` (`id`, `articulation_id`, `language_id`, `type`) VALUES (1, 1, 1, 'staccato');
INSERT INTO `FIPOP`.`articulation_translation` (`id`, `articulation_id`, `language_id`, `type`) VALUES (2, 2, 1, 'legato');
INSERT INTO `FIPOP`.`articulation_translation` (`id`, `articulation_id`, `language_id`, `type`) VALUES (3, 3, 1, 'portato');

COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`church_musical_key`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`church_musical_key` (`id`) VALUES (1);
INSERT INTO `FIPOP`.`church_musical_key` (`id`) VALUES (2);
INSERT INTO `FIPOP`.`church_musical_key` (`id`) VALUES (3);
INSERT INTO `FIPOP`.`church_musical_key` (`id`) VALUES (4);
INSERT INTO `FIPOP`.`church_musical_key` (`id`) VALUES (5);
INSERT INTO `FIPOP`.`church_musical_key` (`id`) VALUES (6);
INSERT INTO `FIPOP`.`church_musical_key` (`id`) VALUES (7);
INSERT INTO `FIPOP`.`church_musical_key` (`id`) VALUES (8);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`church_musical_key_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`church_musical_key_translation` (`id`, `church_musical_key_id`, `language_id`, `type`) VALUES (1, 1, 1, 'Dorian');
INSERT INTO `FIPOP`.`church_musical_key_translation` (`id`, `church_musical_key_id`, `language_id`, `type`) VALUES (2, 2, 1, 'Phrygian');
INSERT INTO `FIPOP`.`church_musical_key_translation` (`id`, `church_musical_key_id`, `language_id`, `type`) VALUES (3, 3, 1, 'Lydian');
INSERT INTO `FIPOP`.`church_musical_key_translation` (`id`, `church_musical_key_id`, `language_id`, `type`) VALUES (4, 4, 1, 'Mixolydian');
INSERT INTO `FIPOP`.`church_musical_key_translation` (`id`, `church_musical_key_id`, `language_id`, `type`) VALUES (5, 5, 1, 'Hypodorian');
INSERT INTO `FIPOP`.`church_musical_key_translation` (`id`, `church_musical_key_id`, `language_id`, `type`) VALUES (6, 6, 1, 'Hypophyrgian');
INSERT INTO `FIPOP`.`church_musical_key_translation` (`id`, `church_musical_key_id`, `language_id`, `type`) VALUES (7, 7, 1, 'Hypolydian');
INSERT INTO `FIPOP`.`church_musical_key_translation` (`id`, `church_musical_key_id`, `language_id`, `type`) VALUES (8, 8, 1, 'Hypomixolydian');

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`voice_leading_pattern`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`voice_leading_pattern` (`id`) VALUES (1);
INSERT INTO `FIPOP`.`voice_leading_pattern` (`id`) VALUES (2);
INSERT INTO `FIPOP`.`voice_leading_pattern` (`id`) VALUES (3);
INSERT INTO `FIPOP`.`voice_leading_pattern` (`id`) VALUES (4);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`voice_leading_pattern_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`voice_leading_pattern_translation` (`id`, `voice_leading_pattern_id`, `language_id`, `type`) VALUES (1, 1, 1, 'monophony');
INSERT INTO `FIPOP`.`voice_leading_pattern_translation` (`id`, `voice_leading_pattern_id`, `language_id`, `type`) VALUES (2, 2, 1, 'polyphony');
INSERT INTO `FIPOP`.`voice_leading_pattern_translation` (`id`, `voice_leading_pattern_id`, `language_id`, `type`) VALUES (3, 3, 1, 'homophony');
INSERT INTO `FIPOP`.`voice_leading_pattern_translation` (`id`, `voice_leading_pattern_id`, `language_id`, `type`) VALUES (4, 4, 1, 'heterophony');
INSERT INTO `FIPOP`.`voice_leading_pattern_translation` (`id`, `voice_leading_pattern_id`, `language_id`, `type`) VALUES (5, 1, 2, 'monophony');
INSERT INTO `FIPOP`.`voice_leading_pattern_translation` (`id`, `voice_leading_pattern_id`, `language_id`, `type`) VALUES (6, 2, 2, 'polyphony');
INSERT INTO `FIPOP`.`voice_leading_pattern_translation` (`id`, `voice_leading_pattern_id`, `language_id`, `type`) VALUES (7, 3, 2, 'homophony');
INSERT INTO `FIPOP`.`voice_leading_pattern_translation` (`id`, `voice_leading_pattern_id`, `language_id`, `type`) VALUES (8, 4, 2, 'heterophony');
INSERT INTO `FIPOP`.`voice_leading_pattern_translation` (`id`, `voice_leading_pattern_id`, `language_id`, `type`) VALUES (9, 1, 3, 'Monophonie');
INSERT INTO `FIPOP`.`voice_leading_pattern_translation` (`id`, `voice_leading_pattern_id`, `language_id`, `type`) VALUES (10, 2, 3, 'Polyphonie');
INSERT INTO `FIPOP`.`voice_leading_pattern_translation` (`id`, `voice_leading_pattern_id`, `language_id`, `type`) VALUES (11, 3, 3, 'Homophonie');
INSERT INTO `FIPOP`.`voice_leading_pattern_translation` (`id`, `voice_leading_pattern_id`, `language_id`, `type`) VALUES (12, 4, 3, 'Heterophonie');

COMMIT;