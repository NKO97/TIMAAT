ALTER TABLE `FIPOP`.`medium_audio` ADD `audio_post_production_id` INT NULL AFTER `audio_codec_information_id`;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
ALTER TABLE `FIPOP`.`medium_audio` ADD  CONSTRAINT `fk_medium_audio_audio_post_production1` FOREIGN KEY (`audio_post_production_id`) REFERENCES `audio_post_production`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
CREATE INDEX `fk_medium_audio_audio_post_production1_idx` ON `FIPOP`.`medium_audio` (`audio_post_production_id` ASC);

DROP TABLE IF EXISTS `FIPOP`.`nasheed_has_title`;
DROP TABLE IF EXISTS `FIPOP`.`nasheed`;

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
-- Table `FIPOP`.`text_setting`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`text_setting` (
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FIPOP`.`text_setting_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`text_setting_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `text_setting_id` INT NOT NULL,
  `language_id` INT NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_text_setting_translation_text_setting1`
    FOREIGN KEY (`text_setting_id`)
    REFERENCES `FIPOP`.`text_setting` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_text_setting_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_text_setting_translation_text_setting1_idx` ON `FIPOP`.`text_setting_translation` (`text_setting_id` ASC);

CREATE INDEX `fk_text_setting_translation_language1_idx` ON `FIPOP`.`text_setting_translation` (`language_id` ASC);


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
-- Table `FIPOP`.`music`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`music` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `music_type_id` INT NOT NULL,
  `display_title_title_id` INT NOT NULL,
  `original_title_title_id` INT NULL,
  `primary_source_medium_id` INT NULL,
  `articulation_id` INT NULL,
  `change_in_dynamics_id` INT NULL,
  `dynamic_marking_id` INT NULL,
  `musical_key_id` INT NULL,
  `tempo_marking_id` INT NULL,
  `text_setting_id` INT NULL,
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
  CONSTRAINT `fk_music_medium1`
    FOREIGN KEY (`primary_source_medium_id`)
    REFERENCES `FIPOP`.`medium` (`id`)
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
  CONSTRAINT `fk_music_articulation1`
    FOREIGN KEY (`articulation_id`)
    REFERENCES `FIPOP`.`articulation` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_tempo_marking1`
    FOREIGN KEY (`tempo_marking_id`)
    REFERENCES `FIPOP`.`tempo_marking` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_text_setting1`
    FOREIGN KEY (`text_setting_id`)
    REFERENCES `FIPOP`.`text_setting` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_music_change_in_dynamics1`
    FOREIGN KEY (`change_in_dynamics_id`)
    REFERENCES `FIPOP`.`change_in_dynamics` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `fk_music_dynamic_marking1_idx` ON `FIPOP`.`music` (`dynamic_marking_id` ASC);

CREATE INDEX `fk_music_audio_post_production1_idx` ON `FIPOP`.`music` (`audio_post_production_id` ASC);

CREATE INDEX `fk_music_musical_key1_idx` ON `FIPOP`.`music` (`musical_key_id` ASC);

CREATE INDEX `fk_music_medium1_idx` ON `FIPOP`.`music` (`primary_source_medium_id` ASC);

CREATE INDEX `fk_music_music_type1_idx` ON `FIPOP`.`music` (`music_type_id` ASC);

CREATE INDEX `fk_music_title1_idx` ON `FIPOP`.`music` (`display_title_title_id` ASC);

CREATE INDEX `fk_music_title2_idx` ON `FIPOP`.`music` (`original_title_title_id` ASC);

CREATE INDEX `fk_music_user_account1_idx` ON `FIPOP`.`music` (`created_by_user_account_id` ASC);

CREATE INDEX `fk_music_user_account2_idx` ON `FIPOP`.`music` (`last_edited_by_user_account_id` ASC);

CREATE INDEX `fk_music_articulation1_idx` ON `FIPOP`.`music` (`articulation_id` ASC);

CREATE INDEX `fk_music_tempo_marking1_idx` ON `FIPOP`.`music` (`tempo_marking_id` ASC);

CREATE INDEX `fk_music_text_setting1_idx` ON `FIPOP`.`music` (`text_setting_id` ASC);

CREATE INDEX `fk_music_change_in_dynamics1_idx` ON `FIPOP`.`music` (`change_in_dynamics_id` ASC);


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
-- Data for table `FIPOP`.`text_setting`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`text_setting` (`id`) VALUES (1);
INSERT INTO `FIPOP`.`text_setting` (`id`) VALUES (2);
INSERT INTO `FIPOP`.`text_setting` (`id`) VALUES (3);
INSERT INTO `FIPOP`.`text_setting` (`id`) VALUES (4);
INSERT INTO `FIPOP`.`text_setting` (`id`) VALUES (5);
INSERT INTO `FIPOP`.`text_setting` (`id`) VALUES (6);

COMMIT;


-- -----------------------------------------------------
-- Data for table `FIPOP`.`text_setting_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`text_setting_translation` (`id`, `text_setting_id`, `language_id`, `type`) VALUES (1, 1, 1, 'melismatic');
INSERT INTO `FIPOP`.`text_setting_translation` (`id`, `text_setting_id`, `language_id`, `type`) VALUES (2, 2, 1, 'syllabic');
INSERT INTO `FIPOP`.`text_setting_translation` (`id`, `text_setting_id`, `language_id`, `type`) VALUES (3, 3, 2, 'melismatic');
INSERT INTO `FIPOP`.`text_setting_translation` (`id`, `text_setting_id`, `language_id`, `type`) VALUES (4, 4, 2, 'syllabic');
INSERT INTO `FIPOP`.`text_setting_translation` (`id`, `text_setting_id`, `language_id`, `type`) VALUES (5, 5, 3, 'melismatisch');
INSERT INTO `FIPOP`.`text_setting_translation` (`id`, `text_setting_id`, `language_id`, `type`) VALUES (6, 6, 3, 'syllabisch');

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