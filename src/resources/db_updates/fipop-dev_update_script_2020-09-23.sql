-- -----------------------------------------------------
-- Table `FIPOP`.`analysis`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`analysis` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `annotation_id` INT NOT NULL,
  `analysis_method_id` INT NOT NULL,
  `preproduction` TEXT NULL,
  `remark` TEXT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_analysis_annotation1`
    FOREIGN KEY (`annotation_id`)
    REFERENCES `FIPOP`.`annotation` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_analysis_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
CREATE INDEX `fk_analysis_annotation1_idx` ON `FIPOP`.`analysis` (`annotation_id` ASC);
CREATE INDEX `fk_analysis_analysis_method1_idx` ON `FIPOP`.`analysis` (`analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`analysis_ambient_sound` CHANGE `id` `analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`analysis_ambient_sound` DROP PRIMARY KEY, ADD PRIMARY KEY (`analysis_method_id`);
ALTER TABLE `FIPOP`.`analysis_ambient_sound` DROP FOREIGN KEY`fk_analysis_ambient_sound_analysis_audio1`;
ALTER TABLE `FIPOP`.`analysis_ambient_sound` ADD CONSTRAINT `fk_analysis_ambient_sound_analysis_method1` FOREIGN KEY (`analysis_method_id`) REFERENCES `FIPOP`.`analysis_method` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX `fk_analysis_ambient_sound_analysis_method1_idx` ON `FIPOP`.`analysis_ambient_sound` (`analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`analysis_ambient_sound_has_ambience` CHANGE `analysis_ambient_sound_id` `analysis_ambient_sound_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`analysis_ambient_sound_has_ambience` DROP PRIMARY KEY, ADD PRIMARY KEY (`analysis_ambient_sound_analysis_method_id`, `ambience_id`);
ALTER TABLE `FIPOP`.`analysis_ambient_sound_has_ambience` DROP FOREIGN KEY `fk_analysis_ambient_sound_has_ambience_analysis_ambient_sound1`; 
ALTER TABLE `FIPOP`.`analysis_ambient_sound_has_ambience` ADD CONSTRAINT `fk_analysis_ambient_sound_has_ambience_analysis_ambient_sound1` FOREIGN KEY (`analysis_ambient_sound_analysis_method_id`) REFERENCES `FIPOP`.`analysis_ambient_sound`(`analysis_method_id`) ON DELETE CASCADE ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`analysis_ambient_sound_has_ambience` DROP INDEX `fk_analysis_ambient_sound_has_ambience_analysis_ambient_so1_idx`;
CREATE INDEX `fk_analysis_ambient_sound_has_ambience_analysis_ambient_so1_idx` ON `FIPOP`.`analysis_ambient_sound_has_ambience` (`analysis_ambient_sound_analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`analysis_ambient_sound_has_noise` CHANGE `analysis_ambient_sound_id` `analysis_ambient_sound_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`analysis_ambient_sound_has_noise` DROP PRIMARY KEY, ADD PRIMARY KEY (`analysis_ambient_sound_analysis_method_id`, `noise_id`);
ALTER TABLE `FIPOP`.`analysis_ambient_sound_has_noise` DROP FOREIGN KEY `fk_analysis_ambient_sound_has_noise_analysis_ambient_sound1`; 
ALTER TABLE `FIPOP`.`analysis_ambient_sound_has_noise` ADD CONSTRAINT `fk_analysis_ambient_sound_has_noise_analysis_ambient_sound1` FOREIGN KEY (`analysis_ambient_sound_analysis_method_id`) REFERENCES `FIPOP`.`analysis_ambient_sound`(`analysis_method_id`) ON DELETE CASCADE ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`analysis_ambient_sound_has_noise` DROP INDEX `fk_analysis_ambient_sound_has_noise_analysis_ambient_sound1_idx`;
CREATE INDEX `fk_analysis_ambient_sound_has_noise_analysis_ambient_sound1_idx` ON `FIPOP`.`analysis_ambient_sound_has_noise` (`analysis_ambient_sound_analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`analysis_ambient_sound_has_sound_effect` CHANGE `analysis_ambient_sound_id` `analysis_ambient_sound_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`analysis_ambient_sound_has_sound_effect` DROP PRIMARY KEY, ADD PRIMARY KEY (`analysis_ambient_sound_analysis_method_id`, `sound_effect_id`);
ALTER TABLE `FIPOP`.`analysis_ambient_sound_has_sound_effect` DROP FOREIGN KEY `fk_analysis_ambient_sound_has_sound_effect_analysis_ambient_so1`; 
ALTER TABLE `FIPOP`.`analysis_ambient_sound_has_sound_effect` ADD CONSTRAINT `fk_analysis_ambient_sound_has_sound_effect_analysis_ambient_so1` FOREIGN KEY (`analysis_ambient_sound_analysis_method_id`) REFERENCES `FIPOP`.`analysis_ambient_sound`(`analysis_method_id`) ON DELETE CASCADE ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`analysis_ambient_sound_has_sound_effect` DROP INDEX `fk_analysis_ambient_sound_has_sound_effect_analysis_ambient_idx`;
CREATE INDEX `fk_analysis_ambient_sound_has_sound_effect_analysis_ambient_idx` ON `FIPOP`.`analysis_ambient_sound_has_sound_effect` (`analysis_ambient_sound_analysis_method_id` ASC);

DROP TABLE `FIPOP`.`analysis_content`;

-- -----------------------------------------------------
-- Table `FIPOP`.`analysis_method`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`analysis_method` (
  `id` INT NOT NULL,
  `analysis_method_type_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_analysis_method_analysis_method_type1`
    FOREIGN KEY (`analysis_method_type_id`)
    REFERENCES `FIPOP`.`analysis_method_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 1000;
CREATE INDEX `fk_analysis_method_analysis_method_type1_idx` ON `FIPOP`.`analysis_method` (`analysis_method_type_id` ASC);

DROP TABLE `FIPOP`.`analysis_content_audio`;

DROP TABLE `FIPOP`.`analysis_content_audio_has_lineup_member`;

RENAME TABLE `FIPOP`.`analysis_content_has_religious_reference` TO `FIPOP`.`analysis_method_has_religious_reference`;
ALTER TABLE `FIPOP`.`analysis_method_has_religious_reference` CHANGE `analysis_content_id` `analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`analysis_method_has_religious_reference` DROP PRIMARY KEY, ADD PRIMARY KEY (`religious_reference_id`, `analysis_method_id`);
ALTER TABLE `FIPOP`.`analysis_method_has_religious_reference` DROP FOREIGN KEY `fk_analysis_content_has_religious_reference_analysis_content1`; 
ALTER TABLE `FIPOP`.`analysis_method_has_religious_reference` ADD CONSTRAINT `fk_analysis_method_has_religious_reference_analysis_method1` FOREIGN KEY (`analysis_method_id`) REFERENCES `FIPOP`.`analysis_method`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`analysis_method_has_religious_reference` ADD CONSTRAINT `fk_analysis_method_has_religious_reference_religious_referenc1` FOREIGN KEY (`religious_reference_id`) REFERENCES `FIPOP`.`religious_reference`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION; 
ALTER TABLE `FIPOP`.`analysis_method_has_religious_reference` DROP INDEX `fk_analysis_content_has_religious_reference_religious_refe1_idx`;
ALTER TABLE `FIPOP`.`analysis_method_has_religious_reference` DROP INDEX `fk_analysis_content_has_religious_reference_analysis_conte1_idx`;
CREATE INDEX `fk_analysis_method_has_religious_reference_religious_refe1_idx` ON `FIPOP`.`analysis_method_has_religious_reference` (`religious_reference_id` ASC);
CREATE INDEX `fk_analysis_method_has_religious_reference_analysis_method_idx` ON `FIPOP`.`analysis_method_has_religious_reference` (`analysis_method_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`analysis_method_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`analysis_method_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `is_static` TINYINT(1) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `FIPOP`.`analysis_method_type_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`analysis_method_type_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `language_id` INT NOT NULL,
  `analysis_method_type_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_analysis_method_type_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_analysis_method_type_translation_analysis_method_type1`
    FOREIGN KEY (`analysis_method_type_id`)
    REFERENCES `FIPOP`.`analysis_method_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
CREATE INDEX `fk_analysis_method_type_translation_language1_idx` ON `FIPOP`.`analysis_method_type_translation` (`language_id` ASC);
CREATE INDEX `fk_analysis_method_type_translation_analysis_method_type1_idx` ON `FIPOP`.`analysis_method_type_translation` (`analysis_method_type_id` ASC);

DROP TABLE `FIPOP`.`analysis_content_visual`;

DROP TABLE `FIPOP`.`analysis_image`;

ALTER TABLE `FIPOP`.`analysis_music` CHANGE `id` `analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`analysis_music` DROP PRIMARY KEY, ADD PRIMARY KEY (`analysis_method_id`);
ALTER TABLE `FIPOP`.`analysis_music` DROP FOREIGN KEY `fk_analysis_music_analysis_audio1`;
ALTER TABLE `FIPOP`.`analysis_music` DROP `analysis_content_audio_id`;
ALTER TABLE `FIPOP`.`analysis_music` ADD CONSTRAINT `fk_analysis_music_analysis_method1` FOREIGN KEY (`analysis_method_id`) REFERENCES `FIPOP`.`analysis_method` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX `fk_analysis_music_analysis_method1_idx` ON `FIPOP`.`analysis_music` (`analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`analysis_music_has_genre` CHANGE `analysis_music_id` `analysis_music_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`analysis_music_has_genre` DROP PRIMARY KEY, ADD PRIMARY KEY (`analysis_music_analysis_method_id`, `genre_id`);
ALTER TABLE `FIPOP`.`analysis_music_has_genre` DROP FOREIGN KEY `fk_analysis_music_has_genre_analysis_music1`;
ALTER TABLE `FIPOP`.`analysis_music_has_genre` ADD CONSTRAINT `fk_analysis_music_has_genre_analysis_music1` FOREIGN KEY (`analysis_music_analysis_method_id`) REFERENCES `FIPOP`.`analysis_music` (`analysis_method_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`analysis_music_has_genre` DROP INDEX `fk_analysis_music_has_genre_analysis_music1_idx`;
CREATE INDEX `fk_analysis_music_has_genre_analysis_music1_idx` ON `FIPOP`.`analysis_music_has_genre` (`analysis_music_analysis_method_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`analysis_music_has_lineup_member`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`analysis_music_has_lineup_member` (
  `analysis_music_analysis_method_id` INT NOT NULL,
  `lineup_member_id` INT NOT NULL,
  PRIMARY KEY (`analysis_music_analysis_method_id`, `lineup_member_id`),
  CONSTRAINT `fk_analysis_music_has_lineup_member_analysis_music1`
    FOREIGN KEY (`analysis_music_analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_music` (`analysis_method_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_analysis_music_has_lineup_member_lineup_member1`
    FOREIGN KEY (`lineup_member_id`)
    REFERENCES `FIPOP`.`lineup_member` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
CREATE INDEX `fk_analysis_music_has_lineup_member_lineup_member1_idx` ON `FIPOP`.`analysis_music_has_lineup_member` (`lineup_member_id` ASC);
CREATE INDEX `fk_analysis_music_has_lineup_member_analysis_music1_idx` ON `FIPOP`.`analysis_music_has_lineup_member` (`analysis_music_analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`analysis_speech` CHANGE `id` `analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`analysis_speech` DROP PRIMARY KEY, ADD PRIMARY KEY (`analysis_method_id`);
ALTER TABLE `FIPOP`.`analysis_speech` DROP FOREIGN KEY `fk_analysis_speech_analysis_audio1`;
ALTER TABLE `FIPOP`.`analysis_speech` DROP `analysis_content_audio_id`;
ALTER TABLE `FIPOP`.`analysis_speech` ADD CONSTRAINT `fk_analysis_speech_analysis_method1` FOREIGN KEY (`analysis_method_id`) REFERENCES `FIPOP`.`analysis_method` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX `fk_analysis_speech_analysis_method1_idx` ON `FIPOP`.`analysis_speech` (`analysis_method_id` ASC);

DROP TABLE `FIPOP`.`analysis_text`;

DROP TABLE `FIPOP`.`analysis_visual_effects`;

ALTER TABLE `FIPOP`.`analysis_voice` CHANGE `id` `analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`analysis_voice` DROP PRIMARY KEY, ADD PRIMARY KEY (`analysis_method_id`);
ALTER TABLE `FIPOP`.`analysis_voice` DROP FOREIGN KEY `fk_analysis_voice_analysis_content_audio1`;
ALTER TABLE `FIPOP`.`analysis_voice` DROP `analysis_content_audio_id`;
ALTER TABLE `FIPOP`.`analysis_voice` ADD CONSTRAINT `fk_analysis_voice_analysis_method1` FOREIGN KEY (`analysis_method_id`) REFERENCES `FIPOP`.`analysis_method` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX `fk_analysis_voice_analysis_method1_idx` ON `FIPOP`.`analysis_voice` (`analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`annotation` DROP FOREIGN KEY `fk_annotation_analysis_content_visual1`;
ALTER TABLE `FIPOP`.`annotation` DROP FOREIGN KEY `fk_annotation_analysis_content_audio1`;
ALTER TABLE `FIPOP`.`annotation` DROP FOREIGN KEY `fk_annotation_content1`;
ALTER TABLE `FIPOP`.`annotation` DROP INDEX `fk_annotation_analysis_content_visual1_idx`;
ALTER TABLE `FIPOP`.`annotation` DROP INDEX `fk_annotation_analysis_content_audio1_idx`;
ALTER TABLE `FIPOP`.`annotation` DROP INDEX `fk_annotation_content1_idx`;
ALTER TABLE `FIPOP`.`annotation` DROP `analysis_content_visual_id`;
ALTER TABLE `FIPOP`.`annotation` DROP `analysis_content_audio_id`;
ALTER TABLE `FIPOP`.`annotation` DROP `analysis_content_id`;

ALTER TABLE `FIPOP`.`barthes_rhetoric_of_the_image` CHANGE `id` `analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`barthes_rhetoric_of_the_image` DROP PRIMARY KEY, ADD PRIMARY KEY (`analysis_method_id`);
ALTER TABLE `FIPOP`.`barthes_rhetoric_of_the_image` ADD CONSTRAINT `fk_barthes_rhetoric_of_the_image_analysis_method1` FOREIGN KEY (`analysis_method_id`) REFERENCES `FIPOP`.`analysis_method` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX `fk_barthes_rhetoric_of_the_image_analysis_method1_idx` ON `FIPOP`.`barthes_rhetoric_of_the_image` (`analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`camera_axis_of_action` CHANGE `id` `analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`camera_axis_of_action` DROP PRIMARY KEY, ADD PRIMARY KEY (`analysis_method_id`);
ALTER TABLE `FIPOP`.`camera_axis_of_action` ADD CONSTRAINT `fk_camera_axis_of_action_analysis_method1` FOREIGN KEY (`analysis_method_id`) REFERENCES `FIPOP`.`analysis_method` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX `fk_camera_axis_of_action_analysis_method1_idx` ON `FIPOP`.`camera_axis_of_action` (`analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`camera_axis_of_action_translation` CHANGE `camera_axis_of_action_id` `camera_axis_of_action_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`camera_axis_of_action_translation` DROP FOREIGN KEY `fk_camera_axis_of_action_translation_camera_axis_of_action1`;
ALTER TABLE `FIPOP`.`camera_axis_of_action_translation` ADD CONSTRAINT `fk_camera_axis_of_action_translation_camera_axis_of_action1` FOREIGN KEY (`camera_axis_of_action_analysis_method_id`) REFERENCES `FIPOP`.`camera_axis_of_action` (`analysis_method_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`camera_axis_of_action_translation` DROP INDEX `fk_camera_axis_of_action_translation_camera_axis_of_action1_idx`;
CREATE INDEX `fk_camera_axis_of_action_translation_camera_axis_of_action1_idx` ON `FIPOP`.`camera_axis_of_action_translation` (`camera_axis_of_action_analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`camera_distance` CHANGE `id` `analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`camera_distance` DROP PRIMARY KEY, ADD PRIMARY KEY (`analysis_method_id`);
ALTER TABLE `FIPOP`.`camera_distance` ADD CONSTRAINT `fk_camera_distance_analysis_method1` FOREIGN KEY (`analysis_method_id`) REFERENCES `FIPOP`.`analysis_method` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX `fk_camera_distance_analysis_method1_idx` ON `FIPOP`.`camera_distance` (`analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`camera_distance_translation` CHANGE `camera_distance_id` `camera_distance_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`camera_distance_translation` DROP FOREIGN KEY `fk_camera_distance_translation_camera_distance1`;
ALTER TABLE `FIPOP`.`camera_distance_translation` ADD CONSTRAINT `fk_camera_distance_translation_camera_distance1` FOREIGN KEY (`camera_distance_analysis_method_id`) REFERENCES `FIPOP`.`camera_distance` (`analysis_method_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`camera_distance_translation` DROP INDEX `fk_camera_distance_translation_camera_distance1_idx`;
CREATE INDEX `fk_camera_distance_translation_camera_distance1_idx` ON `FIPOP`.`camera_distance_translation` (`camera_distance_analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`camera_elevation` CHANGE `id` `analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`camera_elevation` DROP PRIMARY KEY, ADD PRIMARY KEY (`analysis_method_id`);
ALTER TABLE `FIPOP`.`camera_elevation` ADD CONSTRAINT `fk_camera_elevation_analysis_method1` FOREIGN KEY (`analysis_method_id`) REFERENCES `FIPOP`.`analysis_method` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX `fk_camera_elevation_analysis_method1_idx` ON `FIPOP`.`camera_elevation` (`analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`camera_elevation_translation` CHANGE `camera_elevation_id` `camera_elevation_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`camera_elevation_translation` DROP FOREIGN KEY `fk_camera_elevation_translation_camera_elevation1`;
ALTER TABLE `FIPOP`.`camera_elevation_translation` ADD CONSTRAINT `fk_camera_elevation_translation_camera_elevation1` FOREIGN KEY (`camera_elevation_analysis_method_id`) REFERENCES `FIPOP`.`camera_elevation` (`analysis_method_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`camera_elevation_translation` DROP INDEX `fk_camera_elevation_translation_camera_elevation1_idx`;
CREATE INDEX `fk_camera_elevation_translation_camera_elevation1_idx` ON `FIPOP`.`camera_elevation_translation` (`camera_elevation_analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`camera_handling` CHANGE `id` `analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`camera_handling` DROP PRIMARY KEY, ADD PRIMARY KEY (`analysis_method_id`);
ALTER TABLE `FIPOP`.`camera_handling` ADD CONSTRAINT `fk_camera_handling_analysis_method1` FOREIGN KEY (`analysis_method_id`) REFERENCES `FIPOP`.`analysis_method` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX `fk_camera_handling_analysis_method1_idx` ON `FIPOP`.`camera_handling` (`analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`camera_handling_translation` CHANGE `camera_handling_id` `camera_handling_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`camera_handling_translation` DROP FOREIGN KEY `fk_camera_handling_translation_camera_handling1`;
ALTER TABLE `FIPOP`.`camera_handling_translation` ADD CONSTRAINT `fk_camera_handling_translation_camera_handling1` FOREIGN KEY (`camera_handling_analysis_method_id`) REFERENCES `FIPOP`.`camera_handling` (`analysis_method_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`camera_handling_translation` DROP INDEX `fk_camera_handling_translation_camera_handling1_idx`;
CREATE INDEX `fk_camera_handling_translation_camera_handling1_idx` ON `FIPOP`.`camera_handling_translation` (`camera_handling_analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`camera_horizontal_angle` CHANGE `id` `analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`camera_horizontal_angle` DROP PRIMARY KEY, ADD PRIMARY KEY (`analysis_method_id`);
ALTER TABLE `FIPOP`.`camera_horizontal_angle` ADD CONSTRAINT `fk_camera_horizontal_angle_analysis_method1` FOREIGN KEY (`analysis_method_id`) REFERENCES `FIPOP`.`analysis_method` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX `fk_camera_horizontal_angle_analysis_method1_idx` ON `FIPOP`.`camera_horizontal_angle` (`analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`camera_horizontal_angle_translation` CHANGE `camera_horizontal_angle_id` `camera_horizontal_angle_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`camera_horizontal_angle_translation` DROP FOREIGN KEY `fk_camera_horizontal_angle_translation_camera_horizontal_angle1`;
ALTER TABLE `FIPOP`.`camera_horizontal_angle_translation` ADD CONSTRAINT `fk_camera_horizontal_angle_translation_camera_horizontal_angle1` FOREIGN KEY (`camera_horizontal_angle_analysis_method_id`) REFERENCES `FIPOP`.`camera_horizontal_angle` (`analysis_method_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`camera_horizontal_angle_translation` DROP INDEX `fk_camera_horizontal_angle_translation_camera_horizontal_a1_idx`;
CREATE INDEX `fk_camera_horizontal_angle_translation_camera_horizontal_an_idx` ON `FIPOP`.`camera_horizontal_angle_translation` (`camera_horizontal_angle_analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`camera_movement` CHANGE `id` `analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`camera_movement` CHANGE `start_concept_camera_position_and_perspective_id` `start_concept_camera_position_and_perspective_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`camera_movement` CHANGE `end_concept_camera_position_and_perspective_id` `end_concept_camera_position_and_perspective_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`camera_movement` DROP PRIMARY KEY, ADD PRIMARY KEY (`analysis_method_id`);
ALTER TABLE `FIPOP`.`concept_camera_movement_and_handling` CHANGE `id` `analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`concept_camera_movement_and_handling` CHANGE `camera_movement_id` `camera_movement_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`concept_camera_movement_and_handling` CHANGE `camera_handling_id` `camera_handling_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`concept_camera_movement_and_handling` DROP PRIMARY KEY, ADD PRIMARY KEY (`analysis_method_id`);
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` CHANGE `id` `analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` CHANGE `camera_distance_id` `camera_distance_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` CHANGE `camera_shot_type_id` `camera_shot_type_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` CHANGE `camera_vertical_angle_id` `camera_vertical_angle_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` CHANGE `camera_horizontal_angle_id` `camera_horizontal_angle_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` CHANGE `camera_axis_of_action_id` `camera_axis_of_action_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` CHANGE `camera_elevation_id` `camera_elevation_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` DROP PRIMARY KEY, ADD PRIMARY KEY (`analysis_method_id`);

ALTER TABLE `FIPOP`.`camera_movement` DROP FOREIGN KEY `fk_camera_movement_concept_camera_position_and_perspective1`;
ALTER TABLE `FIPOP`.`camera_movement` ADD CONSTRAINT `fk_camera_movement_concept_camera_position_and_perspective1` FOREIGN KEY (`start_concept_camera_position_and_perspective_analysis_method_id`) REFERENCES `FIPOP`.`concept_camera_position_and_perspective` (`analysis_method_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`camera_movement` DROP FOREIGN KEY `fk_camera_movement_concept_camera_position_and_perspective2`;
ALTER TABLE `FIPOP`.`camera_movement` ADD CONSTRAINT `fk_camera_movement_concept_camera_position_and_perspective2` FOREIGN KEY (`end_concept_camera_position_and_perspective_analysis_method_id`) REFERENCES `FIPOP`.`concept_camera_position_and_perspective` (`analysis_method_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`camera_movement` ADD CONSTRAINT `fk_camera_movement_analysis_method1` FOREIGN KEY (`analysis_method_id`) REFERENCES `FIPOP`.`analysis_method` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`camera_movement` DROP INDEX `fk_camera_movement_concept_camera_position_and_perspective1_idx`;
ALTER TABLE `FIPOP`.`camera_movement` DROP INDEX `fk_camera_movement_concept_camera_position_and_perspective2_idx`;
ALTER TABLE `FIPOP`.`camera_movement` DROP INDEX `fk_camera_movement_camera_movement_characteristic1_idx`;
CREATE INDEX `fk_camera_movement_camera_movement_characteristic1_idx` ON `FIPOP`.`camera_movement` (`camera_movement_characteristic_id` ASC);
CREATE INDEX `fk_camera_movement_concept_camera_position_and_perspective1_idx` ON `FIPOP`.`camera_movement` (`start_concept_camera_position_and_perspective_analysis_method_id` ASC);
CREATE INDEX `fk_camera_movement_concept_camera_position_and_perspective2_idx` ON `FIPOP`.`camera_movement` (`end_concept_camera_position_and_perspective_analysis_method_id` ASC);
CREATE INDEX `fk_camera_movement_analysis_method1_idx` ON `FIPOP`.`camera_movement` (`analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`concept_camera_movement_and_handling` DROP FOREIGN KEY `fk_concept_camera_movement_and_handling_camera_movement1`;
ALTER TABLE `FIPOP`.`concept_camera_movement_and_handling` ADD CONSTRAINT `fk_concept_camera_movement_and_handling_camera_movement1` FOREIGN KEY (`camera_movement_analysis_method_id`) REFERENCES `FIPOP`.`camera_movement` (`analysis_method_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`concept_camera_movement_and_handling` DROP FOREIGN KEY `fk_concept_camera_movement_and_handling_camera_handling1`;
ALTER TABLE `FIPOP`.`concept_camera_movement_and_handling` ADD CONSTRAINT `fk_concept_camera_movement_and_handling_camera_handling1` FOREIGN KEY (`camera_handling_analysis_method_id`) REFERENCES `FIPOP`.`camera_handling` (`analysis_method_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`concept_camera_movement_and_handling` ADD CONSTRAINT `fk_concept_camera_movement_and_handling_analysis_method1` FOREIGN KEY (`analysis_method_id`) REFERENCES `FIPOP`.`analysis_method` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`concept_camera_movement_and_handling` DROP INDEX `fk_concept_camera_movement_and_handling_camera_mo1_idx`;
ALTER TABLE `FIPOP`.`concept_camera_movement_and_handling` DROP INDEX `fk_concept_camera_movement_and_handling_camera_ha1_idx`;
CREATE INDEX `fk_concept_camera_movement_and_handling_analysis_method1_idx` ON `FIPOP`.`concept_camera_movement_and_handling` (`analysis_method_id` ASC);
CREATE INDEX `fk_concept_camera_movement_and_handling_camera_movement1_idx` ON `FIPOP`.`concept_camera_movement_and_handling` (`camera_movement_analysis_method_id` ASC);
CREATE INDEX `fk_concept_camera_movement_and_handling_camera_handling1_idx` ON `FIPOP`.`concept_camera_movement_and_handling` (`camera_handling_analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`camera_movement_translation` CHANGE `camera_movement_id` `camera_movement_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`camera_movement_translation` DROP FOREIGN KEY `fk_camera_movement_translation_camera_movement1`;
ALTER TABLE `FIPOP`.`camera_movement_translation` ADD CONSTRAINT `fk_camera_movement_translation_camera_movement1` FOREIGN KEY (`camera_movement_analysis_method_id`) REFERENCES `FIPOP`.`camera_movement` (`analysis_method_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`camera_movement_translation` DROP INDEX `fk_camera_movement_translation_camera_movement1_idx`;
CREATE INDEX `fk_camera_movement_translation_camera_movement1_idx` ON `FIPOP`.`camera_movement_translation` (`camera_movement_analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`camera_shot_type` CHANGE `id` `analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`camera_shot_type` CHANGE `camera_distance_id` `camera_distance_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`camera_shot_type` DROP PRIMARY KEY, ADD PRIMARY KEY (`analysis_method_id`);
ALTER TABLE `FIPOP`.`camera_shot_type` DROP FOREIGN KEY `fk_camera_shot_type_camera_distance1`;
ALTER TABLE `FIPOP`.`camera_shot_type` ADD CONSTRAINT `fk_camera_shot_type_camera_distance1` FOREIGN KEY (`camera_distance_analysis_method_id`) REFERENCES `FIPOP`.`camera_distance` (`analysis_method_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`camera_shot_type` ADD CONSTRAINT `fk_camera_shot_type_analysis_method1` FOREIGN KEY (`analysis_method_id`) REFERENCES `FIPOP`.`analysis_method` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`camera_shot_type` DROP INDEX `fk_camera_shot_type_camera_distance1_idx`;
CREATE INDEX `fk_camera_shot_type_camera_distance1_idx` ON `FIPOP`.`camera_shot_type` (`camera_distance_analysis_method_id` ASC);
CREATE INDEX `fk_camera_shot_type_analysis_method1_idx` ON `FIPOP`.`camera_shot_type` (`analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`camera_shot_type_translation` CHANGE `camera_shot_type_id` `camera_shot_type_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`camera_shot_type_translation` DROP FOREIGN KEY `fk_camera_shot_type_translation_camera_shot_type1`;
ALTER TABLE `FIPOP`.`camera_shot_type_translation` ADD CONSTRAINT `fk_camera_shot_type_translation_camera_shot_type1` FOREIGN KEY (`camera_shot_type_analysis_method_id`) REFERENCES `FIPOP`.`camera_shot_type` (`analysis_method_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`camera_shot_type_translation` DROP INDEX `fk_camera_shot_type_translation_camera_shot_type1_idx`;
CREATE INDEX `fk_camera_shot_type_translation_camera_shot_type1_idx` ON `FIPOP`.`camera_shot_type_translation` (`camera_shot_type_analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`camera_vertical_angle` CHANGE `id` `analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`camera_vertical_angle` DROP PRIMARY KEY, ADD PRIMARY KEY (`analysis_method_id`);
ALTER TABLE `FIPOP`.`camera_vertical_angle` ADD CONSTRAINT `fk_camera_vertical_angle_analysis_method1` FOREIGN KEY (`analysis_method_id`) REFERENCES `FIPOP`.`analysis_method` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX `fk_camera_vertical_angle_analysis_method1_idx` ON `FIPOP`.`camera_vertical_angle` (`analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`camera_vertical_angle_translation` CHANGE `camera_vertical_angle_id` `camera_vertical_angle_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`camera_vertical_angle_translation` DROP FOREIGN KEY `fk_camera_vertical_angle_translation_camera_vertical_angle1`;
ALTER TABLE `FIPOP`.`camera_vertical_angle_translation` ADD CONSTRAINT `fk_camera_vertical_angle_translation_camera_vertical_angle1` FOREIGN KEY (`camera_vertical_angle_analysis_method_id`) REFERENCES `FIPOP`.`camera_vertical_angle` (`analysis_method_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`camera_vertical_angle_translation` DROP INDEX `fk_camera_vertical_angle_translation_camera_vertical_angle1_idx`;
CREATE INDEX `fk_camera_vertical_angle_translation_camera_vertical_angle1_idx` ON `FIPOP`.`camera_vertical_angle_translation` (`camera_vertical_angle_analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` ADD CONSTRAINT `fk_concept_camera_position_and_perspective_analysis_method1` FOREIGN KEY (`analysis_method_id`) REFERENCES `FIPOP`.`analysis_method` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` DROP FOREIGN KEY `fk_concept_camera_position_and_perspective_camera_distance1`;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` ADD CONSTRAINT `fk_concept_camera_position_and_perspective_camera_distance1` FOREIGN KEY (`camera_distance_analysis_method_id`) REFERENCES `FIPOP`.`camera_distance` (`analysis_method_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` DROP FOREIGN KEY `fk_concept_camera_position_and_perspective_camera_shot_type1`;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` ADD CONSTRAINT `fk_concept_camera_position_and_perspective_camera_shot_type1` FOREIGN KEY (`camera_shot_type_analysis_method_id`) REFERENCES `FIPOP`.`camera_shot_type` (`analysis_method_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` DROP FOREIGN KEY `fk_concept_camera_position_and_perspective_camera_vertical_an1`;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` ADD CONSTRAINT `fk_concept_camera_position_and_perspective_camera_vertical_an1` FOREIGN KEY (`camera_vertical_angle_analysis_method_id`) REFERENCES `FIPOP`.`camera_vertical_angle` (`analysis_method_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` DROP FOREIGN KEY `fk_concept_camera_position_and_perspective_camera_horizontal1`;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` ADD CONSTRAINT `fk_concept_camera_position_and_perspective_camera_horizontal1` FOREIGN KEY (`camera_horizontal_angle_analysis_method_id`) REFERENCES `FIPOP`.`camera_horizontal_angle` (`analysis_method_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` DROP FOREIGN KEY `fk_concept_camera_position_and_perspective_camera_axis_of_act1`;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` ADD CONSTRAINT `fk_concept_camera_position_and_perspective_camera_axis_of_act1` FOREIGN KEY (`camera_axis_of_action_analysis_method_id`) REFERENCES `FIPOP`.`camera_axis_of_action` (`analysis_method_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` DROP FOREIGN KEY `fk_concept_camera_position_and_perspective_camera_elevation1`;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` ADD CONSTRAINT `fk_concept_camera_position_and_perspective_camera_elevation1` FOREIGN KEY (`camera_elevation_analysis_method_id`) REFERENCES `FIPOP`.`camera_elevation` (`analysis_method_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` DROP INDEX `fk_concept_camera_position_and_perspective_camera_distanc1_idx`;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` DROP INDEX `fk_concept_camera_position_and_perspective_camera_shot_ty1_idx`;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` DROP INDEX `fk_concept_camera_position_and_perspective_camera_vertica1_idx`;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` DROP INDEX `fk_concept_camera_position_and_perspective_camera_horizon1_idx`;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` DROP INDEX `fk_concept_camera_position_and_perspective_camera_axis_of1_idx`;
ALTER TABLE `FIPOP`.`concept_camera_position_and_perspective` DROP INDEX `fk_concept_camera_position_and_perspective_camera_elevati1_idx`;
CREATE INDEX `fk_concept_camera_position_and_perspective_analysis_method1_idx` ON `FIPOP`.`concept_camera_position_and_perspective` (`analysis_method_id` ASC);
CREATE INDEX `fk_concept_camera_position_and_perspective_camera_distance1_idx` ON `FIPOP`.`concept_camera_position_and_perspective` (`camera_distance_analysis_method_id` ASC);
CREATE INDEX `fk_concept_camera_position_and_perspective_camera_shot_type_idx` ON `FIPOP`.`concept_camera_position_and_perspective` (`camera_shot_type_analysis_method_id` ASC);
CREATE INDEX `fk_concept_camera_position_and_perspective_camera_vertical__idx` ON `FIPOP`.`concept_camera_position_and_perspective` (`camera_vertical_angle_analysis_method_id` ASC);
CREATE INDEX `fk_concept_camera_position_and_perspective_camera_horizonta_idx` ON `FIPOP`.`concept_camera_position_and_perspective` (`camera_horizontal_angle_analysis_method_id` ASC);
CREATE INDEX `fk_concept_camera_position_and_perspective_camera_elevation_idx` ON `FIPOP`.`concept_camera_position_and_perspective` (`camera_elevation_analysis_method_id` ASC);
CREATE INDEX `fk_concept_camera_position_and_perspective_camera_axis_of_a_idx` ON `FIPOP`.`concept_camera_position_and_perspective` (`camera_axis_of_action_analysis_method_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`color_temperature`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`color_temperature` (
  `analysis_method_id` INT NOT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_camera_elevation_analysis_method10`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
CREATE INDEX `fk_camera_elevation_analysis_method1_idx` ON `FIPOP`.`color_temperature` (`analysis_method_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`color_temperature_translation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`color_temperature_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `language_id` INT NOT NULL,
  `color_temperature_analysis_method_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_color_temperature_translation_color_temperature1`
    FOREIGN KEY (`color_temperature_analysis_method_id`)
    REFERENCES `FIPOP`.`color_temperature` (`analysis_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_color_temperature_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `FIPOP`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
CREATE INDEX `fk_color_temperature_translation_color_temperature1_idx` ON `FIPOP`.`color_temperature_translation` (`color_temperature_analysis_method_id` ASC);
CREATE INDEX `fk_color_temperature_translation_language1_idx` ON `FIPOP`.`color_temperature_translation` (`language_id` ASC);

ALTER TABLE `FIPOP`.`connoted_image` CHANGE `barthes_rhetoric_of_the_image_id` `barthes_rhetoric_of_the_image_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`connoted_image` DROP FOREIGN KEY `fk_connoted_image_barthes_rhetoric_of_the_image1`;
ALTER TABLE `FIPOP`.`connoted_image` ADD CONSTRAINT `fk_connoted_image_barthes_rhetoric_of_the_image1` FOREIGN KEY (`barthes_rhetoric_of_the_image_analysis_method_id`) REFERENCES `FIPOP`.`barthes_rhetoric_of_the_image` (`analysis_method_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`connoted_image` DROP INDEX `fk_connoted_image_barthes_rhetoric_of_the_image1_idx`;
CREATE INDEX `fk_connoted_image_barthes_rhetoric_of_the_image1_idx` ON `FIPOP`.`connoted_image` (`barthes_rhetoric_of_the_image_analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`denoted_image` CHANGE `barthes_rhetoric_of_the_image_id` `barthes_rhetoric_of_the_image_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`denoted_image` DROP FOREIGN KEY `fk_denoted_image_barthes_rhetoric_of_the_image1`;
ALTER TABLE `FIPOP`.`denoted_image` ADD CONSTRAINT `fk_denoted_image_barthes_rhetoric_of_the_image1` FOREIGN KEY (`barthes_rhetoric_of_the_image_analysis_method_id`) REFERENCES `FIPOP`.`barthes_rhetoric_of_the_image` (`analysis_method_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`denoted_image` DROP INDEX `fk_denoted_image_barthes_rhetoric_of_the_image1_idx`;
CREATE INDEX `fk_denoted_image_barthes_rhetoric_of_the_image1_idx` ON `FIPOP`.`denoted_image` (`barthes_rhetoric_of_the_image_analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`genette_narrative_discourse` CHANGE `id` `analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`genette_narrative_discourse` DROP PRIMARY KEY, ADD PRIMARY KEY (`analysis_method_id`);
ALTER TABLE `FIPOP`.`genette_narrative_discourse` ADD CONSTRAINT `fk_genette_narrative_discourse_analysis_method1` FOREIGN KEY (`analysis_method_id`) REFERENCES `FIPOP`.`analysis_method` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX `fk_genette_narrative_discourse_analysis_method1_idx` ON `FIPOP`.`genette_narrative_discourse` (`analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`greimas_actantial_model` CHANGE `id` `analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`greimas_actantial_model` DROP PRIMARY KEY, ADD PRIMARY KEY (`analysis_method_id`);
ALTER TABLE `FIPOP`.`greimas_actantial_model` ADD CONSTRAINT `fk_greimas_actantial_model_analysis_method1` FOREIGN KEY (`analysis_method_id`) REFERENCES `FIPOP`.`analysis_method` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX `fk_greimas_actantial_model_analysis_method1_idx` ON `FIPOP`.`greimas_actantial_model` (`analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`greimas_actantial_model_has_actor` CHANGE `greimas_actantial_model_id` `greimas_actantial_model_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`greimas_actantial_model_has_actor` DROP PRIMARY KEY, ADD PRIMARY KEY (`greimas_actantial_model_analysis_method_id`, `actor_id`, `actantial_model_facet_type_id`);
ALTER TABLE `FIPOP`.`greimas_actantial_model_has_actor` DROP FOREIGN KEY `fk_greimas_actantial_model_has_actor_greimas_actantial_model1`;
ALTER TABLE `FIPOP`.`greimas_actantial_model_has_actor` ADD CONSTRAINT `fk_greimas_actantial_model_has_actor_greimas_actantial_model1` FOREIGN KEY (`greimas_actantial_model_analysis_method_id`) REFERENCES `FIPOP`.`greimas_actantial_model` (`analysis_method_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`greimas_actantial_model_has_actor` DROP INDEX `fk_greimas_actantial_model_has_actor_greimas_actantial_mod1_idx`;
CREATE INDEX `fk_greimas_actantial_model_has_actor_greimas_actantial_mod1_idx` ON `FIPOP`.`greimas_actantial_model_has_actor` (`greimas_actantial_model_analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`greimas_actantial_model_has_concept` CHANGE `greimas_actantial_model_id` `greimas_actantial_model_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`greimas_actantial_model_has_concept` DROP PRIMARY KEY, ADD PRIMARY KEY (`greimas_actantial_model_analysis_method_id`, `actantial_model_facet_type_id`);
ALTER TABLE `FIPOP`.`greimas_actantial_model_has_concept` DROP FOREIGN KEY `fk_greimas_actantial_model_has_concept_greimas_actantial_model1`;
ALTER TABLE `FIPOP`.`greimas_actantial_model_has_concept` ADD CONSTRAINT `fk_greimas_actantial_model_has_concept_greimas_actantial_model1` FOREIGN KEY (`greimas_actantial_model_analysis_method_id`) REFERENCES `FIPOP`.`greimas_actantial_model` (`analysis_method_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`greimas_actantial_model_has_concept` DROP FOREIGN KEY `fk_greimas_actantial_model_has_concept_concept1`;
ALTER TABLE `FIPOP`.`greimas_actantial_model_has_concept` DROP INDEX `fk_greimas_actantial_model_has_concept_concept1_idx`;
ALTER TABLE `FIPOP`.`greimas_actantial_model_has_concept` DROP INDEX `fk_greimas_actantial_model_has_concept_greimas_actantial_m1_idx`;
CREATE INDEX `fk_greimas_actantial_model_has_concept_greimas_actantial_m1_idx` ON `FIPOP`.`greimas_actantial_model_has_concept` (`greimas_actantial_model_analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`greimas_actantial_model_translation` CHANGE `greimas_actantial_model_id` `greimas_actantial_model_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`greimas_actantial_model_translation` DROP FOREIGN KEY `fk_greimas_actantial_model_translation_greimas_actantial_model1`;
ALTER TABLE `FIPOP`.`greimas_actantial_model_translation` ADD CONSTRAINT `fk_greimas_actantial_model_translation_greimas_actantial_model1` FOREIGN KEY (`greimas_actantial_model_analysis_method_id`) REFERENCES `FIPOP`.`greimas_actantial_model` (`analysis_method_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`greimas_actantial_model_translation` DROP INDEX `fk_greimas_actantial_model_translation_greimas_actantial_m1_idx`;
CREATE INDEX `fk_greimas_actantial_model_translation_greimas_actantial_m1_idx` ON `FIPOP`.`greimas_actantial_model_translation` (`greimas_actantial_model_analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`lexia` CHANGE `barthes_rhetoric_of_the_image_id` `barthes_rhetoric_of_the_image_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`lexia` DROP FOREIGN KEY `fk_lexia_barthes_rhetoric_of_the_image1`;
ALTER TABLE `FIPOP`.`lexia` ADD CONSTRAINT `fk_lexia_barthes_rhetoric_of_the_image1` FOREIGN KEY (`barthes_rhetoric_of_the_image_analysis_method_id`) REFERENCES `FIPOP`.`barthes_rhetoric_of_the_image` (`analysis_method_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`lexia` DROP INDEX `fk_lexia_barthes_rhetoric_of_the_image1_idx`;
CREATE INDEX `fk_lexia_barthes_rhetoric_of_the_image1_idx` ON `FIPOP`.`lexia` (`barthes_rhetoric_of_the_image_analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`linguistic_message` CHANGE `barthes_rhetoric_of_the_image_id` `barthes_rhetoric_of_the_image_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`linguistic_message` DROP FOREIGN KEY `fk_linguistic_message_barthes_rhetoric_of_the_image1`;
ALTER TABLE `FIPOP`.`linguistic_message` ADD CONSTRAINT `fk_linguistic_message_barthes_rhetoric_of_the_image1` FOREIGN KEY (`barthes_rhetoric_of_the_image_analysis_method_id`) REFERENCES `FIPOP`.`barthes_rhetoric_of_the_image` (`analysis_method_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`linguistic_message` DROP INDEX `fk_linguistic_message_barthes_rhetoric_of_the_image1_idx`;
CREATE INDEX `fk_linguistic_message_barthes_rhetoric_of_the_image1_idx` ON `FIPOP`.`linguistic_message` (`barthes_rhetoric_of_the_image_analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`lotman_renner_spatial_semantics` CHANGE `id` `analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`lotman_renner_spatial_semantics` DROP PRIMARY KEY, ADD PRIMARY KEY (`analysis_method_id`);
ALTER TABLE `FIPOP`.`lotman_renner_spatial_semantics` ADD CONSTRAINT `fk_lotman_renner_spatial_semantics_analysis_method1` FOREIGN KEY (`analysis_method_id`) REFERENCES `FIPOP`.`analysis_method` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX `fk_lotman_renner_spatial_semantics_analysis_method1_idx` ON `FIPOP`.`lotman_renner_spatial_semantics` (`analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`martinez_scheffel_unreliable_narration` CHANGE `id` `analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`martinez_scheffel_unreliable_narration` DROP PRIMARY KEY, ADD PRIMARY KEY (`analysis_method_id`);
ALTER TABLE `FIPOP`.`martinez_scheffel_unreliable_narration` ADD CONSTRAINT `fk_martinez_scheffel_unreliable_narration_analysis_method1` FOREIGN KEY (`analysis_method_id`) REFERENCES `FIPOP`.`analysis_method` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX `fk_martinez_scheffel_unreliable_narration_analysis_method1_idx` ON `FIPOP`.`martinez_scheffel_unreliable_narration` (`analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`martinez_scheffel_unreliable_narration_translation` CHANGE `martinez_scheffel_unreliable_narration_id` `martinez_scheffel_unreliable_narration_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`martinez_scheffel_unreliable_narration_translation` DROP FOREIGN KEY `fk_martinez_scheffel_unreliable_narration_translation_martinez1`;
ALTER TABLE `FIPOP`.`martinez_scheffel_unreliable_narration_translation` ADD CONSTRAINT `fk_martinez_scheffel_unreliable_narration_translation_martinez1` FOREIGN KEY (`martinez_scheffel_unreliable_narration_analysis_method_id`) REFERENCES `FIPOP`.`martinez_scheffel_unreliable_narration` (`analysis_method_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`martinez_scheffel_unreliable_narration_translation` DROP INDEX `fk_martinez_scheffel_unreliable_narration_translation_Mart1_idx`;
CREATE INDEX `fk_martinez_scheffel_unreliable_narration_translation_marti_idx` ON `FIPOP`.`martinez_scheffel_unreliable_narration_translation` (`martinez_scheffel_unreliable_narration_analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`musical_notation` CHANGE `analysis_music_id` `analysis_music_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`musical_notation` CHANGE `analysis_voice_id` `analysis_voice_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`musical_notation` DROP FOREIGN KEY `fk_musical_notation_analysis_music1`;
ALTER TABLE `FIPOP`.`musical_notation` ADD CONSTRAINT `fk_musical_notation_analysis_music1` FOREIGN KEY (`analysis_music_analysis_method_id`) REFERENCES `FIPOP`.`analysis_music` (`analysis_method_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`musical_notation` DROP FOREIGN KEY `fk_musical_notation_analysis_voice1`;
ALTER TABLE `FIPOP`.`musical_notation` ADD CONSTRAINT `fk_musical_notation_analysis_voice1` FOREIGN KEY (`analysis_voice_analysis_method_id`) REFERENCES `FIPOP`.`analysis_voice` (`analysis_method_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`musical_notation` DROP INDEX `fk_musical_notation_analysis_music1_idx`;
ALTER TABLE `FIPOP`.`musical_notation` DROP INDEX `fk_musical_notation_analysis_voice1_idx`;
ALTER TABLE `FIPOP`.`musical_notation` DROP INDEX `fk_musical_notation_medium1_idx`;
CREATE INDEX `fk_musical_notation_medium1_idx` ON `FIPOP`.`musical_notation` (`medium_id` ASC);
CREATE INDEX `fk_musical_notation_analysis_music1_idx` ON `FIPOP`.`musical_notation` (`analysis_music_analysis_method_id` ASC);
CREATE INDEX `fk_musical_notation_analysis_voice1_idx` ON `FIPOP`.`musical_notation` (`analysis_voice_analysis_method_id` ASC);

-- -----------------------------------------------------
-- Table `FIPOP`.`sound_effect_descriptive`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FIPOP`.`sound_effect_descriptive` (
  `analysis_method_id` INT NOT NULL AUTO_INCREMENT,
  `answer_q1` TEXT NULL,
  `answer_q2` TEXT NULL,
  `answer_q3` TEXT NULL,
  `answer_q4` TEXT NULL,
  `answer_q5` TEXT NULL,
  `answer_q6` TEXT NULL,
  PRIMARY KEY (`analysis_method_id`),
  CONSTRAINT `fk_sound_effect_descriptive_analysis_method1`
    FOREIGN KEY (`analysis_method_id`)
    REFERENCES `FIPOP`.`analysis_method` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
CREATE INDEX `fk_sound_effect_descriptive_analysis_method1_idx` ON `FIPOP`.`sound_effect_descriptive` (`analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`spatial_semantics_type_actor_person` CHANGE `id` `id` INT NOT NULL AUTO_INCREMENT;
ALTER TABLE `FIPOP`.`spatial_semantics_type_actor_person` CHANGE `lotman_renner_spatial_semantics_id` `lotman_renner_spatial_semantics_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`spatial_semantics_type_actor_person` DROP FOREIGN KEY `fk_spatial_semantics_type_actor_person_lotman_renner_spatial_s1`;
ALTER TABLE `FIPOP`.`spatial_semantics_type_actor_person` ADD CONSTRAINT `fk_spatial_semantics_type_actor_person_lotman_renner_spatial_s1` FOREIGN KEY (`lotman_renner_spatial_semantics_analysis_method_id`) REFERENCES `FIPOP`.`lotman_renner_spatial_semantics` (`analysis_method_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`spatial_semantics_type_actor_person` DROP INDEX `fk_spatial_semantics_type_actor_person_lotman_renner_spatia1_idx`;
CREATE INDEX `fk_spatial_semantics_type_actor_person_lotman_renner_spatia_idx` ON `FIPOP`.`spatial_semantics_type_actor_person` (`lotman_renner_spatial_semantics_analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`spatial_semantics_type_space` CHANGE `id` `id` INT NOT NULL AUTO_INCREMENT;
ALTER TABLE `FIPOP`.`spatial_semantics_type_space` CHANGE `lotman_renner_spatial_semantics_id` `lotman_renner_spatial_semantics_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`spatial_semantics_type_space` DROP FOREIGN KEY `fk_spatial_semantics_type_space_lotman_renner_spatial_semantics1`;
ALTER TABLE `FIPOP`.`spatial_semantics_type_space` ADD CONSTRAINT `fk_spatial_semantics_type_space_lotman_renner_spatial_semantics1` FOREIGN KEY (`lotman_renner_spatial_semantics_analysis_method_id`) REFERENCES `FIPOP`.`lotman_renner_spatial_semantics` (`analysis_method_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`spatial_semantics_type_space` DROP INDEX `fk_spatial_semantics_type_space_lotman_renner_spatial_sema1_idx`;
CREATE INDEX `fk_spatial_semantics_type_space_lotman_renner_spatial_seman_idx` ON `FIPOP`.`spatial_semantics_type_space` (`lotman_renner_spatial_semantics_analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`stanzel_narrative_situations` CHANGE `id` `analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`stanzel_narrative_situations` DROP PRIMARY KEY, ADD PRIMARY KEY (`analysis_method_id`);
ALTER TABLE `FIPOP`.`stanzel_narrative_situations` ADD CONSTRAINT `fk_stanzel_narrative_situations_analysis_method1` FOREIGN KEY (`analysis_method_id`) REFERENCES `FIPOP`.`analysis_method` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX `fk_stanzel_narrative_situations_analysis_method1_idx` ON `FIPOP`.`stanzel_narrative_situations` (`analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`van_sijll_cinematic_storytelling` CHANGE `id` `analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`van_sijll_cinematic_storytelling` DROP PRIMARY KEY, ADD PRIMARY KEY (`analysis_method_id`);
ALTER TABLE `FIPOP`.`van_sijll_cinematic_storytelling` ADD CONSTRAINT `fk_van_sijll_cinematic_storytelling_analysis_method1` FOREIGN KEY (`analysis_method_id`) REFERENCES `FIPOP`.`analysis_method` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX `fk_van_sijll_cinematic_storytelling_analysis_method1_idx` ON `FIPOP`.`van_sijll_cinematic_storytelling` (`analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`van_sijll_cinematic_storytelling_translation` CHANGE `van_sijll_cinematic_storytelling_id` `van_sijll_cinematic_storytelling_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`van_sijll_cinematic_storytelling_translation` DROP FOREIGN KEY `fk_van_sijll_cinematic_storytelling_translation_van_sijll_cine1`;
ALTER TABLE `FIPOP`.`van_sijll_cinematic_storytelling_translation` ADD CONSTRAINT `fk_van_sijll_cinematic_storytelling_translation_van_sijll_cine1` FOREIGN KEY (`van_sijll_cinematic_storytelling_analysis_method_id`) REFERENCES `FIPOP`.`van_sijll_cinematic_storytelling` (`analysis_method_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`van_sijll_cinematic_storytelling_translation` DROP INDEX `fk_van_sijll_cinematic_storytelling_translation_van_sijll_1_idx`;
CREATE INDEX `fk_van_sijll_cinematic_storytelling_translation_van_sijll_c_idx` ON `FIPOP`.`van_sijll_cinematic_storytelling_translation` (`van_sijll_cinematic_storytelling_analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`zelizer_beese_voice_of_the_visual` CHANGE `id` `analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`zelizer_beese_voice_of_the_visual` DROP PRIMARY KEY, ADD PRIMARY KEY (`analysis_method_id`);
ALTER TABLE `FIPOP`.`zelizer_beese_voice_of_the_visual` ADD CONSTRAINT `fk_zelizer_beese_voice_of_the_visual_analysis_method1` FOREIGN KEY (`analysis_method_id`) REFERENCES `FIPOP`.`analysis_method` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
CREATE INDEX `fk_zelizer_beese_voice_of_the_visual_analysis_method1_idx` ON `FIPOP`.`zelizer_beese_voice_of_the_visual` (`analysis_method_id` ASC);

ALTER TABLE `FIPOP`.`zelizer_beese_voice_of_the_visual_translation` CHANGE `zelizer_beese_voice_of_the_visual_id` `zelizer_beese_voice_of_the_visual_analysis_method_id` INT NOT NULL;
ALTER TABLE `FIPOP`.`zelizer_beese_voice_of_the_visual_translation` DROP FOREIGN KEY `fk_zelizer_beese_voice_of_the_visual_translation_zelizer_beese1`;
ALTER TABLE `FIPOP`.`zelizer_beese_voice_of_the_visual_translation` ADD CONSTRAINT `fk_zelizer_beese_voice_of_the_visual_translation_zelizer_beese1` FOREIGN KEY (`zelizer_beese_voice_of_the_visual_analysis_method_id`) REFERENCES `FIPOP`.`zelizer_beese_voice_of_the_visual` (`analysis_method_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `FIPOP`.`zelizer_beese_voice_of_the_visual_translation` DROP INDEX `fk_zelizer_beese_voice_of_the_visual_translation_zelizer_b1_idx`;
CREATE INDEX `fk_zelizer_beese_voice_of_the_visual_translation_zelizer_be_idx` ON `FIPOP`.`zelizer_beese_voice_of_the_visual_translation` (`zelizer_beese_voice_of_the_visual_analysis_method_id` ASC);

-- -----------------------------------------------------
-- Data for table `FIPOP`.`analysis_method`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (1, 1);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (2, 1);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (3, 1);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (4, 1);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (5, 1);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (6, 1);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (7, 7);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (8, 7);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (9, 7);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (10, 9);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (11, 9);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (12, 9);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (13, 9);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (14, 9);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (15, 9);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (16, 9);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (17, 9);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (18, 9);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (19, 10);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (20, 10);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (21, 10);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (22, 10);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (23, 10);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (24, 10);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (25, 10);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (26, 10);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (27, 11);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (28, 11);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (29, 11);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (30, 11);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (31, 11);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (32, 11);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (33, 11);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (34, 11);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (35, 11);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (36, 11);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (37, 12);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (38, 12);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (39, 12);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (40, 12);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (41, 12);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (42, 12);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (43, 12);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (44, 12);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (45, 12);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (46, 12);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (47, 13);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (48, 13);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (49, 13);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (50, 13);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (51, 13);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (52, 13);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (53, 13);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (54, 13);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (55, 14);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (56, 14);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (57, 14);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (58, 14);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (59, 17);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (60, 17);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (61, 17);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (62, 17);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (63, 17);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (64, 17);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (65, 17);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (66, 18);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (67, 18);
INSERT INTO `FIPOP`.`analysis_method` (`id`, `analysis_method_type_id`) VALUES (68, 18);
COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`analysis_method_type`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (1, 1);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (2, 0);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (3, 0);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (4, 0);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (5, 0);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (6, 0);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (7, 1);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (8, 0);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (9, 1);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (10, 1);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (11, 1);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (12, 1);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (13, 1);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (14, 1);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (15, 0);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (16, 0);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (17, 1);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (18, 1);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (19, 0);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (20, 0);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (21, 0);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (22, 0);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (23, 0);
INSERT INTO `FIPOP`.`analysis_method_type` (`id`, `is_static`) VALUES (24, 0);
COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`analysis_method_type_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (1, 1, 1, 'MartinezScheffelUnreliableNarration');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (2, 1, 2, 'GreimasActantialModel');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (3, 1, 3, 'VanSijllCinematicStorytelling');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (4, 1, 4, 'LotmanRennerSpacialSemantics');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (5, 1, 5, 'GenetteNarrativeDiscourse');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (6, 1, 6, 'StanzelNarrativeSituations');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (7, 1, 7, 'ColorTemperature');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (8, 1, 8, 'ConceptCameraMovementAndDirection');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (9, 1, 9, 'CameraElevation');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (10, 1, 10, 'CameraAxisOfAction');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (11, 1, 11, 'CameraHorizontalAngle');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (12, 1, 12, 'CameraVerticalAngle');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (13, 1, 13, 'CameraShotType');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (14, 1, 14, 'CameraDistance');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (15, 1, 15, 'ConceptCameraMovementAndHandling');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (16, 1, 16, 'CameraMovement');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (17, 1, 17, 'CameraHandling');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (18, 1, 18, 'ZelizerBeeseVoiceOfTheVisual');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (19, 1, 19, 'BarthesRhetoricOfTheImage');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (20, 1, 20, 'SoundEffectDescriptive');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (21, 1, 21, 'AnalysisAmbientSound');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (22, 1, 22, 'AnalysisMusic');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (23, 1, 23, 'AnalysisSpeech');
INSERT INTO `FIPOP`.`analysis_method_type_translation` (`id`, `language_id`, `analysis_method_type_id`, `name`) VALUES (24, 1, 24, 'AnalysisVoice');
COMMIT;

TRUNCATE TABLE `FIPOP`.`camera_axis_of_action`;
-- -----------------------------------------------------
-- Data for table `FIPOP`.`camera_axis_of_action`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`camera_axis_of_action` (`analysis_method_id`, `max_angle`, `min_angle`) VALUES (19, '91', '179');
INSERT INTO `FIPOP`.`camera_axis_of_action` (`analysis_method_id`, `max_angle`, `min_angle`) VALUES (20, '90', '90');
INSERT INTO `FIPOP`.`camera_axis_of_action` (`analysis_method_id`, `max_angle`, `min_angle`) VALUES (21, '1', '89');
INSERT INTO `FIPOP`.`camera_axis_of_action` (`analysis_method_id`, `max_angle`, `min_angle`) VALUES (22, '0', '0');
INSERT INTO `FIPOP`.`camera_axis_of_action` (`analysis_method_id`, `max_angle`, `min_angle`) VALUES (23, '-1', '-89');
INSERT INTO `FIPOP`.`camera_axis_of_action` (`analysis_method_id`, `max_angle`, `min_angle`) VALUES (24, '-90', '-90');
INSERT INTO `FIPOP`.`camera_axis_of_action` (`analysis_method_id`, `max_angle`, `min_angle`) VALUES (25, '-91', '-179');
INSERT INTO `FIPOP`.`camera_axis_of_action` (`analysis_method_id`, `max_angle`, `min_angle`) VALUES (26, '-180', '-180');
COMMIT;

TRUNCATE TABLE `FIPOP`.`camera_axis_of_action_translation`;
-- -----------------------------------------------------
-- Data for table `FIPOP`.`camera_axis_of_action_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`camera_axis_of_action_translation` (`id`, `camera_axis_of_action_analysis_method_id`, `language_id`, `name`) VALUES (1, 19, 1, 'Right View (Back)');
INSERT INTO `FIPOP`.`camera_axis_of_action_translation` (`id`, `camera_axis_of_action_analysis_method_id`, `language_id`, `name`) VALUES (2, 20, 1, 'Right Angle (Right)');
INSERT INTO `FIPOP`.`camera_axis_of_action_translation` (`id`, `camera_axis_of_action_analysis_method_id`, `language_id`, `name`) VALUES (3, 21, 1, 'Right view (Front)');
INSERT INTO `FIPOP`.`camera_axis_of_action_translation` (`id`, `camera_axis_of_action_analysis_method_id`, `language_id`, `name`) VALUES (4, 22, 1, 'Front View');
INSERT INTO `FIPOP`.`camera_axis_of_action_translation` (`id`, `camera_axis_of_action_analysis_method_id`, `language_id`, `name`) VALUES (5, 23, 1, 'Left View (Front)');
INSERT INTO `FIPOP`.`camera_axis_of_action_translation` (`id`, `camera_axis_of_action_analysis_method_id`, `language_id`, `name`) VALUES (6, 24, 1, 'Right Angle (left)');
INSERT INTO `FIPOP`.`camera_axis_of_action_translation` (`id`, `camera_axis_of_action_analysis_method_id`, `language_id`, `name`) VALUES (7, 25, 1, 'Left View (Back)');
INSERT INTO `FIPOP`.`camera_axis_of_action_translation` (`id`, `camera_axis_of_action_analysis_method_id`, `language_id`, `name`) VALUES (8, 26, 1, 'Back View');
INSERT INTO `FIPOP`.`camera_axis_of_action_translation` (`id`, `camera_axis_of_action_analysis_method_id`, `language_id`, `name`) VALUES (9, 19, 2, 'Right View (Back)');
INSERT INTO `FIPOP`.`camera_axis_of_action_translation` (`id`, `camera_axis_of_action_analysis_method_id`, `language_id`, `name`) VALUES (10, 20, 2, 'Right Angle (Right)');
INSERT INTO `FIPOP`.`camera_axis_of_action_translation` (`id`, `camera_axis_of_action_analysis_method_id`, `language_id`, `name`) VALUES (11, 21, 2, 'Right view (Front)');
INSERT INTO `FIPOP`.`camera_axis_of_action_translation` (`id`, `camera_axis_of_action_analysis_method_id`, `language_id`, `name`) VALUES (12, 22, 2, 'Front View');
INSERT INTO `FIPOP`.`camera_axis_of_action_translation` (`id`, `camera_axis_of_action_analysis_method_id`, `language_id`, `name`) VALUES (13, 23, 2, 'Left View (Front)');
INSERT INTO `FIPOP`.`camera_axis_of_action_translation` (`id`, `camera_axis_of_action_analysis_method_id`, `language_id`, `name`) VALUES (14, 24, 2, 'Right Angle (left)');
INSERT INTO `FIPOP`.`camera_axis_of_action_translation` (`id`, `camera_axis_of_action_analysis_method_id`, `language_id`, `name`) VALUES (15, 25, 2, 'Left View (Back)');
INSERT INTO `FIPOP`.`camera_axis_of_action_translation` (`id`, `camera_axis_of_action_analysis_method_id`, `language_id`, `name`) VALUES (16, 26, 2, 'Back View');
INSERT INTO `FIPOP`.`camera_axis_of_action_translation` (`id`, `camera_axis_of_action_analysis_method_id`, `language_id`, `name`) VALUES (17, 19, 3, 'schräg von hinten (rechts)');
INSERT INTO `FIPOP`.`camera_axis_of_action_translation` (`id`, `camera_axis_of_action_analysis_method_id`, `language_id`, `name`) VALUES (18, 20, 3, 'im Profil (rechts)');
INSERT INTO `FIPOP`.`camera_axis_of_action_translation` (`id`, `camera_axis_of_action_analysis_method_id`, `language_id`, `name`) VALUES (19, 21, 3, 'schräg von vorne (rechts)');
INSERT INTO `FIPOP`.`camera_axis_of_action_translation` (`id`, `camera_axis_of_action_analysis_method_id`, `language_id`, `name`) VALUES (20, 22, 3, 'Vorderansicht');
INSERT INTO `FIPOP`.`camera_axis_of_action_translation` (`id`, `camera_axis_of_action_analysis_method_id`, `language_id`, `name`) VALUES (21, 23, 3, 'schräg von vorne (links)');
INSERT INTO `FIPOP`.`camera_axis_of_action_translation` (`id`, `camera_axis_of_action_analysis_method_id`, `language_id`, `name`) VALUES (22, 24, 3, 'im Profil (links)');
INSERT INTO `FIPOP`.`camera_axis_of_action_translation` (`id`, `camera_axis_of_action_analysis_method_id`, `language_id`, `name`) VALUES (23, 25, 3, 'schräg von hinten (links)');
INSERT INTO `FIPOP`.`camera_axis_of_action_translation` (`id`, `camera_axis_of_action_analysis_method_id`, `language_id`, `name`) VALUES (24, 26, 3, 'Rückansicht');
COMMIT;

TRUNCATE TABLE `FIPOP`.`camera_distance`;
-- -----------------------------------------------------
-- Data for table `FIPOP`.`camera_distance`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`camera_distance` (`analysis_method_id`) VALUES (55);
INSERT INTO `FIPOP`.`camera_distance` (`analysis_method_id`) VALUES (56);
INSERT INTO `FIPOP`.`camera_distance` (`analysis_method_id`) VALUES (57);
INSERT INTO `FIPOP`.`camera_distance` (`analysis_method_id`) VALUES (58);
COMMIT;

TRUNCATE TABLE `FIPOP`.`camera_distance_translation`;
-- -----------------------------------------------------
-- Data for table `FIPOP`.`camera_distance_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`camera_distance_translation` (`id`, `camera_distance_analysis_method_id`, `language_id`, `name`) VALUES (1, 55, 1, 'Far / Public');
INSERT INTO `FIPOP`.`camera_distance_translation` (`id`, `camera_distance_analysis_method_id`, `language_id`, `name`) VALUES (2, 56, 1, 'Medium / Social');
INSERT INTO `FIPOP`.`camera_distance_translation` (`id`, `camera_distance_analysis_method_id`, `language_id`, `name`) VALUES (3, 57, 1, 'Close / Personal');
INSERT INTO `FIPOP`.`camera_distance_translation` (`id`, `camera_distance_analysis_method_id`, `language_id`, `name`) VALUES (4, 58, 1, 'Very Close / Intimate');
INSERT INTO `FIPOP`.`camera_distance_translation` (`id`, `camera_distance_analysis_method_id`, `language_id`, `name`) VALUES (5, 55, 2, 'Far / Public');
INSERT INTO `FIPOP`.`camera_distance_translation` (`id`, `camera_distance_analysis_method_id`, `language_id`, `name`) VALUES (6, 56, 2, 'Medium / Social');
INSERT INTO `FIPOP`.`camera_distance_translation` (`id`, `camera_distance_analysis_method_id`, `language_id`, `name`) VALUES (7, 57, 2, 'Close / Personal');
INSERT INTO `FIPOP`.`camera_distance_translation` (`id`, `camera_distance_analysis_method_id`, `language_id`, `name`) VALUES (8, 58, 2, 'Very Close / Intimate');
INSERT INTO `FIPOP`.`camera_distance_translation` (`id`, `camera_distance_analysis_method_id`, `language_id`, `name`) VALUES (9, 55, 3, 'Öffentliche Distanz (Fern)');
INSERT INTO `FIPOP`.`camera_distance_translation` (`id`, `camera_distance_analysis_method_id`, `language_id`, `name`) VALUES (10, 56, 3, 'Soziale Distanz (Mittel)');
INSERT INTO `FIPOP`.`camera_distance_translation` (`id`, `camera_distance_analysis_method_id`, `language_id`, `name`) VALUES (11, 57, 3, 'Persönliche Distanz (Nah)');
INSERT INTO `FIPOP`.`camera_distance_translation` (`id`, `camera_distance_analysis_method_id`, `language_id`, `name`) VALUES (12, 58, 3, 'Intime Distanz (Gross)');
COMMIT;

TRUNCATE TABLE `FIPOP`.`camera_elevation`;
-- -----------------------------------------------------
-- Data for table `FIPOP`.`camera_elevation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`camera_elevation` (`analysis_method_id`) VALUES (10);
INSERT INTO `FIPOP`.`camera_elevation` (`analysis_method_id`) VALUES (11);
INSERT INTO `FIPOP`.`camera_elevation` (`analysis_method_id`) VALUES (12);
INSERT INTO `FIPOP`.`camera_elevation` (`analysis_method_id`) VALUES (13);
INSERT INTO `FIPOP`.`camera_elevation` (`analysis_method_id`) VALUES (14);
INSERT INTO `FIPOP`.`camera_elevation` (`analysis_method_id`) VALUES (15);
INSERT INTO `FIPOP`.`camera_elevation` (`analysis_method_id`) VALUES (16);
INSERT INTO `FIPOP`.`camera_elevation` (`analysis_method_id`) VALUES (17);
INSERT INTO `FIPOP`.`camera_elevation` (`analysis_method_id`) VALUES (18);
COMMIT;

TRUNCATE TABLE `FIPOP`.`camera_elevation_translation`;
-- -----------------------------------------------------
-- Data for table `FIPOP`.`camera_elevation_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`camera_elevation_translation` (`id`, `camera_elevation_analysis_method_id`, `language_id`, `name`) VALUES (1, 10, 1, 'extreme high');
INSERT INTO `FIPOP`.`camera_elevation_translation` (`id`, `camera_elevation_analysis_method_id`, `language_id`, `name`) VALUES (2, 11, 1, 'very high');
INSERT INTO `FIPOP`.`camera_elevation_translation` (`id`, `camera_elevation_analysis_method_id`, `language_id`, `name`) VALUES (3, 12, 1, 'high');
INSERT INTO `FIPOP`.`camera_elevation_translation` (`id`, `camera_elevation_analysis_method_id`, `language_id`, `name`) VALUES (4, 13, 1, 'eye level (elevated)');
INSERT INTO `FIPOP`.`camera_elevation_translation` (`id`, `camera_elevation_analysis_method_id`, `language_id`, `name`) VALUES (5, 14, 1, 'eye Level');
INSERT INTO `FIPOP`.`camera_elevation_translation` (`id`, `camera_elevation_analysis_method_id`, `language_id`, `name`) VALUES (6, 15, 1, 'eye Level (low height)');
INSERT INTO `FIPOP`.`camera_elevation_translation` (`id`, `camera_elevation_analysis_method_id`, `language_id`, `name`) VALUES (7, 16, 1, 'low');
INSERT INTO `FIPOP`.`camera_elevation_translation` (`id`, `camera_elevation_analysis_method_id`, `language_id`, `name`) VALUES (8, 17, 1, 'very low');
INSERT INTO `FIPOP`.`camera_elevation_translation` (`id`, `camera_elevation_analysis_method_id`, `language_id`, `name`) VALUES (9, 18, 1, 'extreme low');
INSERT INTO `FIPOP`.`camera_elevation_translation` (`id`, `camera_elevation_analysis_method_id`, `language_id`, `name`) VALUES (10, 10, 2, 'extreme high');
INSERT INTO `FIPOP`.`camera_elevation_translation` (`id`, `camera_elevation_analysis_method_id`, `language_id`, `name`) VALUES (11, 11, 2, 'very high');
INSERT INTO `FIPOP`.`camera_elevation_translation` (`id`, `camera_elevation_analysis_method_id`, `language_id`, `name`) VALUES (12, 12, 2, 'high');
INSERT INTO `FIPOP`.`camera_elevation_translation` (`id`, `camera_elevation_analysis_method_id`, `language_id`, `name`) VALUES (13, 13, 2, 'eye level (elevated)');
INSERT INTO `FIPOP`.`camera_elevation_translation` (`id`, `camera_elevation_analysis_method_id`, `language_id`, `name`) VALUES (14, 14, 2, 'eye Level');
INSERT INTO `FIPOP`.`camera_elevation_translation` (`id`, `camera_elevation_analysis_method_id`, `language_id`, `name`) VALUES (15, 15, 2, 'eye Level (low height)');
INSERT INTO `FIPOP`.`camera_elevation_translation` (`id`, `camera_elevation_analysis_method_id`, `language_id`, `name`) VALUES (16, 16, 2, 'low');
INSERT INTO `FIPOP`.`camera_elevation_translation` (`id`, `camera_elevation_analysis_method_id`, `language_id`, `name`) VALUES (17, 17, 2, 'very low');
INSERT INTO `FIPOP`.`camera_elevation_translation` (`id`, `camera_elevation_analysis_method_id`, `language_id`, `name`) VALUES (18, 18, 2, 'extreme low');
INSERT INTO `FIPOP`.`camera_elevation_translation` (`id`, `camera_elevation_analysis_method_id`, `language_id`, `name`) VALUES (19, 10, 3, 'extrem erhöht');
INSERT INTO `FIPOP`.`camera_elevation_translation` (`id`, `camera_elevation_analysis_method_id`, `language_id`, `name`) VALUES (20, 11, 3, 'stark erhöht');
INSERT INTO `FIPOP`.`camera_elevation_translation` (`id`, `camera_elevation_analysis_method_id`, `language_id`, `name`) VALUES (21, 12, 3, 'leicht erhöht');
INSERT INTO `FIPOP`.`camera_elevation_translation` (`id`, `camera_elevation_analysis_method_id`, `language_id`, `name`) VALUES (22, 13, 3, 'Augenhöhe (erhöht)');
INSERT INTO `FIPOP`.`camera_elevation_translation` (`id`, `camera_elevation_analysis_method_id`, `language_id`, `name`) VALUES (23, 14, 3, 'Augenhöhe');
INSERT INTO `FIPOP`.`camera_elevation_translation` (`id`, `camera_elevation_analysis_method_id`, `language_id`, `name`) VALUES (24, 15, 3, 'Augenhöhe (sitzend)');
INSERT INTO `FIPOP`.`camera_elevation_translation` (`id`, `camera_elevation_analysis_method_id`, `language_id`, `name`) VALUES (25, 16, 3, 'leicht verringert');
INSERT INTO `FIPOP`.`camera_elevation_translation` (`id`, `camera_elevation_analysis_method_id`, `language_id`, `name`) VALUES (26, 17, 3, 'stark verringert');
INSERT INTO `FIPOP`.`camera_elevation_translation` (`id`, `camera_elevation_analysis_method_id`, `language_id`, `name`) VALUES (27, 18, 3, 'extrem verringert');
COMMIT;

TRUNCATE TABLE `FIPOP`.`camera_handling`;
-- -----------------------------------------------------
-- Data for table `FIPOP`.`camera_handling`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`camera_handling` (`analysis_method_id`) VALUES (59);
INSERT INTO `FIPOP`.`camera_handling` (`analysis_method_id`) VALUES (60);
INSERT INTO `FIPOP`.`camera_handling` (`analysis_method_id`) VALUES (61);
INSERT INTO `FIPOP`.`camera_handling` (`analysis_method_id`) VALUES (62);
INSERT INTO `FIPOP`.`camera_handling` (`analysis_method_id`) VALUES (63);
INSERT INTO `FIPOP`.`camera_handling` (`analysis_method_id`) VALUES (64);
INSERT INTO `FIPOP`.`camera_handling` (`analysis_method_id`) VALUES (65);
COMMIT;

TRUNCATE TABLE `FIPOP`.`camera_handling_translation`;
-- -----------------------------------------------------
-- Data for table `FIPOP`.`camera_handling_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`camera_handling_translation` (`id`, `camera_handling_analysis_method_id`, `language_id`, `type`) VALUES (1, 59, 1, 'static');
INSERT INTO `FIPOP`.`camera_handling_translation` (`id`, `camera_handling_analysis_method_id`, `language_id`, `type`) VALUES (2, 60, 1, 'handheld');
INSERT INTO `FIPOP`.`camera_handling_translation` (`id`, `camera_handling_analysis_method_id`, `language_id`, `type`) VALUES (3, 61, 1, 'Shaky Cam');
INSERT INTO `FIPOP`.`camera_handling_translation` (`id`, `camera_handling_analysis_method_id`, `language_id`, `type`) VALUES (4, 62, 1, 'Dolly');
INSERT INTO `FIPOP`.`camera_handling_translation` (`id`, `camera_handling_analysis_method_id`, `language_id`, `type`) VALUES (5, 63, 1, 'sliding/floating');
INSERT INTO `FIPOP`.`camera_handling_translation` (`id`, `camera_handling_analysis_method_id`, `language_id`, `type`) VALUES (6, 64, 1, 'aerial');
INSERT INTO `FIPOP`.`camera_handling_translation` (`id`, `camera_handling_analysis_method_id`, `language_id`, `type`) VALUES (7, 65, 1, 'attached');
INSERT INTO `FIPOP`.`camera_handling_translation` (`id`, `camera_handling_analysis_method_id`, `language_id`, `type`) VALUES (8, 59, 2, 'static');
INSERT INTO `FIPOP`.`camera_handling_translation` (`id`, `camera_handling_analysis_method_id`, `language_id`, `type`) VALUES (9, 60, 2, 'handheld');
INSERT INTO `FIPOP`.`camera_handling_translation` (`id`, `camera_handling_analysis_method_id`, `language_id`, `type`) VALUES (10, 61, 2, 'Shaky Cam');
INSERT INTO `FIPOP`.`camera_handling_translation` (`id`, `camera_handling_analysis_method_id`, `language_id`, `type`) VALUES (11, 62, 2, 'Dolly');
INSERT INTO `FIPOP`.`camera_handling_translation` (`id`, `camera_handling_analysis_method_id`, `language_id`, `type`) VALUES (12, 63, 2, 'sliding, floating');
INSERT INTO `FIPOP`.`camera_handling_translation` (`id`, `camera_handling_analysis_method_id`, `language_id`, `type`) VALUES (13, 64, 2, 'aerial');
INSERT INTO `FIPOP`.`camera_handling_translation` (`id`, `camera_handling_analysis_method_id`, `language_id`, `type`) VALUES (14, 65, 2, 'attached');
INSERT INTO `FIPOP`.`camera_handling_translation` (`id`, `camera_handling_analysis_method_id`, `language_id`, `type`) VALUES (15, 59, 3, 'statisch');
INSERT INTO `FIPOP`.`camera_handling_translation` (`id`, `camera_handling_analysis_method_id`, `language_id`, `type`) VALUES (16, 60, 3, 'handgeführt');
INSERT INTO `FIPOP`.`camera_handling_translation` (`id`, `camera_handling_analysis_method_id`, `language_id`, `type`) VALUES (17, 61, 3, 'verwackelt');
INSERT INTO `FIPOP`.`camera_handling_translation` (`id`, `camera_handling_analysis_method_id`, `language_id`, `type`) VALUES (18, 62, 3, 'fahrend');
INSERT INTO `FIPOP`.`camera_handling_translation` (`id`, `camera_handling_analysis_method_id`, `language_id`, `type`) VALUES (19, 63, 3, 'gleitend');
INSERT INTO `FIPOP`.`camera_handling_translation` (`id`, `camera_handling_analysis_method_id`, `language_id`, `type`) VALUES (20, 64, 3, 'fliegend');
INSERT INTO `FIPOP`.`camera_handling_translation` (`id`, `camera_handling_analysis_method_id`, `language_id`, `type`) VALUES (21, 65, 3, 'körper- / objektgebunden');
COMMIT;

TRUNCATE TABLE `FIPOP`.`camera_horizontal_angle`;
-- -----------------------------------------------------
-- Data for table `FIPOP`.`camera_horizontal_angle`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`camera_horizontal_angle` (`analysis_method_id`, `min_angle`, `max_angle`) VALUES (27, 90, 90);
INSERT INTO `FIPOP`.`camera_horizontal_angle` (`analysis_method_id`, `min_angle`, `max_angle`) VALUES (28, 45, 89);
INSERT INTO `FIPOP`.`camera_horizontal_angle` (`analysis_method_id`, `min_angle`, `max_angle`) VALUES (29, 1, 44);
INSERT INTO `FIPOP`.`camera_horizontal_angle` (`analysis_method_id`, `min_angle`, `max_angle`) VALUES (30, 0, 0);
INSERT INTO `FIPOP`.`camera_horizontal_angle` (`analysis_method_id`, `min_angle`, `max_angle`) VALUES (31, -1, -44);
INSERT INTO `FIPOP`.`camera_horizontal_angle` (`analysis_method_id`, `min_angle`, `max_angle`) VALUES (32, -45, -89);
INSERT INTO `FIPOP`.`camera_horizontal_angle` (`analysis_method_id`, `min_angle`, `max_angle`) VALUES (33, -90, -90);
INSERT INTO `FIPOP`.`camera_horizontal_angle` (`analysis_method_id`, `min_angle`, `max_angle`) VALUES (34, 91, 179);
INSERT INTO `FIPOP`.`camera_horizontal_angle` (`analysis_method_id`, `min_angle`, `max_angle`) VALUES (35, -91, -179);
INSERT INTO `FIPOP`.`camera_horizontal_angle` (`analysis_method_id`, `min_angle`, `max_angle`) VALUES (36, -180, -180);
COMMIT;

TRUNCATE TABLE `FIPOP`.`camera_horizontal_angle_translation`;
-- -----------------------------------------------------
-- Data for table `FIPOP`.`camera_horizontal_angle_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (1, 27, 1, 'Left-Tilt');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (2, 28, 1, 'Strong Left-Tilt');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (3, 29, 1, 'Slight Left-Tilt');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (4, 30, 1, 'In Balance');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (5, 31, 1, 'Slight Right-Tilt');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (6, 32, 1, 'Strong Right-Tilt');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (7, 33, 1, 'Right-Tilt');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (8, 34, 1, 'upside down, clockwise');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (9, 35, 1, 'upside down, counter-clockwise');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (10, 36, 1, 'upside down, in balance');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (11, 27, 2, 'Left-Tilt');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (12, 28, 2, 'Strong Left-Tilt');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (13, 29, 2, 'Slight Left-Tilt');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (14, 30, 2, 'In Balance');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (15, 31, 2, 'Slight Right-Tilt');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (16, 32, 2, 'Strong Right-Tilt');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (17, 33, 2, 'Right-Tilt');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (18, 34, 2, 'upside down, clockwise');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (19, 35, 2, 'upside down, counter-clockwise');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (20, 36, 2, 'upside down, in balance');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (21, 27, 3, 'links gekippt (Kamera / Bild nach rechts)');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (22, 28, 3, 'stark links-verkantet (Kamera / Bild nach rechts)');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (23, 29, 3, 'leicht links-verkantet (Kamera / Bild nach rechts)');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (24, 30, 3, '(Normalposition / lotrechte Position)');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (25, 31, 3, 'leicht rechts-verkantet (Kamera / Bild nach links)');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (26, 32, 3, 'starkt rechts-verkantet (Kamera / Bild nach links)');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (27, 33, 3, 'rechts gekippt (Kamera / Bild nach links)');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (28, 34, 3, 'Überkopfposition, linksgedrehte Kamera');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (29, 35, 3, 'Überkopfposition, rechtsgedrehte Kamera');
INSERT INTO `FIPOP`.`camera_horizontal_angle_translation` (`id`, `camera_horizontal_angle_analysis_method_id`, `language_id`, `name`) VALUES (30, 36, 3, 'Normalposition, überkopf');
COMMIT;

TRUNCATE TABLE `FIPOP`.`camera_movement`;

TRUNCATE TABLE `FIPOP`.`camera_movement_translation`;
-- -----------------------------------------------------
-- Data for table `FIPOP`.`camera_movement_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`camera_movement_translation` (`id`, `camera_movement_analysis_method_id`, `language_id`, `type`) VALUES (1, 1, 1, 'Movement (Camera)');
INSERT INTO `FIPOP`.`camera_movement_translation` (`id`, `camera_movement_analysis_method_id`, `language_id`, `type`) VALUES (2, 2, 1, 'Movement (Object)');
INSERT INTO `FIPOP`.`camera_movement_translation` (`id`, `camera_movement_analysis_method_id`, `language_id`, `type`) VALUES (3, 3, 1, 'Zoom in');
INSERT INTO `FIPOP`.`camera_movement_translation` (`id`, `camera_movement_analysis_method_id`, `language_id`, `type`) VALUES (4, 4, 1, 'Panning/Tilting');
INSERT INTO `FIPOP`.`camera_movement_translation` (`id`, `camera_movement_analysis_method_id`, `language_id`, `type`) VALUES (5, 5, 1, 'Roll');
INSERT INTO `FIPOP`.`camera_movement_translation` (`id`, `camera_movement_analysis_method_id`, `language_id`, `type`) VALUES (6, 6, 1, 'Tumbling');
INSERT INTO `FIPOP`.`camera_movement_translation` (`id`, `camera_movement_analysis_method_id`, `language_id`, `type`) VALUES (7, 1, 2, 'Movement (Camera)');
INSERT INTO `FIPOP`.`camera_movement_translation` (`id`, `camera_movement_analysis_method_id`, `language_id`, `type`) VALUES (8, 2, 2, 'Movement (Object)');
INSERT INTO `FIPOP`.`camera_movement_translation` (`id`, `camera_movement_analysis_method_id`, `language_id`, `type`) VALUES (9, 3, 2, 'Zoom in');
INSERT INTO `FIPOP`.`camera_movement_translation` (`id`, `camera_movement_analysis_method_id`, `language_id`, `type`) VALUES (10, 4, 2, 'Panning (left-right)/Tilting (up-down)');
INSERT INTO `FIPOP`.`camera_movement_translation` (`id`, `camera_movement_analysis_method_id`, `language_id`, `type`) VALUES (11, 5, 2, 'Roll');
INSERT INTO `FIPOP`.`camera_movement_translation` (`id`, `camera_movement_analysis_method_id`, `language_id`, `type`) VALUES (12, 6, 2, 'Tumbling');
INSERT INTO `FIPOP`.`camera_movement_translation` (`id`, `camera_movement_analysis_method_id`, `language_id`, `type`) VALUES (13, 1, 3, 'Bewegung (Kamera)');
INSERT INTO `FIPOP`.`camera_movement_translation` (`id`, `camera_movement_analysis_method_id`, `language_id`, `type`) VALUES (14, 2, 3, 'Bewegung (Darstellungsobjekt)');
INSERT INTO `FIPOP`.`camera_movement_translation` (`id`, `camera_movement_analysis_method_id`, `language_id`, `type`) VALUES (15, 3, 3, 'Zoom');
INSERT INTO `FIPOP`.`camera_movement_translation` (`id`, `camera_movement_analysis_method_id`, `language_id`, `type`) VALUES (16, 4, 3, 'Schwenk');
INSERT INTO `FIPOP`.`camera_movement_translation` (`id`, `camera_movement_analysis_method_id`, `language_id`, `type`) VALUES (17, 5, 3, 'Rollen');
INSERT INTO `FIPOP`.`camera_movement_translation` (`id`, `camera_movement_analysis_method_id`, `language_id`, `type`) VALUES (18, 6, 3, 'Taumeln');
COMMIT;

TRUNCATE TABLE `FIPOP`.`camera_shot_type`;
-- -----------------------------------------------------
-- Data for table `FIPOP`.`camera_shot_type`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`camera_shot_type` (`analysis_method_id`, `camera_distance_analysis_method_id`) VALUES (47, 55);
INSERT INTO `FIPOP`.`camera_shot_type` (`analysis_method_id`, `camera_distance_analysis_method_id`) VALUES (48, 55);
INSERT INTO `FIPOP`.`camera_shot_type` (`analysis_method_id`, `camera_distance_analysis_method_id`) VALUES (49, 56);
INSERT INTO `FIPOP`.`camera_shot_type` (`analysis_method_id`, `camera_distance_analysis_method_id`) VALUES (50, 56);
INSERT INTO `FIPOP`.`camera_shot_type` (`analysis_method_id`, `camera_distance_analysis_method_id`) VALUES (51, 57);
INSERT INTO `FIPOP`.`camera_shot_type` (`analysis_method_id`, `camera_distance_analysis_method_id`) VALUES (52, 57);
INSERT INTO `FIPOP`.`camera_shot_type` (`analysis_method_id`, `camera_distance_analysis_method_id`) VALUES (53, 58);
INSERT INTO `FIPOP`.`camera_shot_type` (`analysis_method_id`, `camera_distance_analysis_method_id`) VALUES (54, 58);
COMMIT;

TRUNCATE TABLE `FIPOP`.`camera_shot_type_translation`;
-- -----------------------------------------------------
-- Data for table `FIPOP`.`camera_shot_type_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`camera_shot_type_translation` (`id`, `camera_shot_type_analysis_method_id`, `language_id`, `type`) VALUES (1, 47, 1, 'Extreme Long Shot');
INSERT INTO `FIPOP`.`camera_shot_type_translation` (`id`, `camera_shot_type_analysis_method_id`, `language_id`, `type`) VALUES (2, 48, 1, 'Long Shot');
INSERT INTO `FIPOP`.`camera_shot_type_translation` (`id`, `camera_shot_type_analysis_method_id`, `language_id`, `type`) VALUES (3, 49, 1, 'Medium Long Shot');
INSERT INTO `FIPOP`.`camera_shot_type_translation` (`id`, `camera_shot_type_analysis_method_id`, `language_id`, `type`) VALUES (4, 50, 1, 'American Shot');
INSERT INTO `FIPOP`.`camera_shot_type_translation` (`id`, `camera_shot_type_analysis_method_id`, `language_id`, `type`) VALUES (5, 51, 1, 'Medium Shot');
INSERT INTO `FIPOP`.`camera_shot_type_translation` (`id`, `camera_shot_type_analysis_method_id`, `language_id`, `type`) VALUES (6, 52, 1, 'Medium Close-up');
INSERT INTO `FIPOP`.`camera_shot_type_translation` (`id`, `camera_shot_type_analysis_method_id`, `language_id`, `type`) VALUES (7, 53, 1, 'Close-up');
INSERT INTO `FIPOP`.`camera_shot_type_translation` (`id`, `camera_shot_type_analysis_method_id`, `language_id`, `type`) VALUES (8, 54, 1, 'Extreme Close-up');
INSERT INTO `FIPOP`.`camera_shot_type_translation` (`id`, `camera_shot_type_analysis_method_id`, `language_id`, `type`) VALUES (9, 47, 2, 'Extreme Long Shot');
INSERT INTO `FIPOP`.`camera_shot_type_translation` (`id`, `camera_shot_type_analysis_method_id`, `language_id`, `type`) VALUES (10, 48, 2, 'Long Shot');
INSERT INTO `FIPOP`.`camera_shot_type_translation` (`id`, `camera_shot_type_analysis_method_id`, `language_id`, `type`) VALUES (11, 49, 2, 'Medium Long Shot');
INSERT INTO `FIPOP`.`camera_shot_type_translation` (`id`, `camera_shot_type_analysis_method_id`, `language_id`, `type`) VALUES (12, 50, 2, 'American Shot');
INSERT INTO `FIPOP`.`camera_shot_type_translation` (`id`, `camera_shot_type_analysis_method_id`, `language_id`, `type`) VALUES (13, 51, 2, 'Medium Shot');
INSERT INTO `FIPOP`.`camera_shot_type_translation` (`id`, `camera_shot_type_analysis_method_id`, `language_id`, `type`) VALUES (14, 52, 2, 'Medium Close-up');
INSERT INTO `FIPOP`.`camera_shot_type_translation` (`id`, `camera_shot_type_analysis_method_id`, `language_id`, `type`) VALUES (15, 53, 2, 'Close-up');
INSERT INTO `FIPOP`.`camera_shot_type_translation` (`id`, `camera_shot_type_analysis_method_id`, `language_id`, `type`) VALUES (16, 54, 2, 'Extreme Close-up');
INSERT INTO `FIPOP`.`camera_shot_type_translation` (`id`, `camera_shot_type_analysis_method_id`, `language_id`, `type`) VALUES (17, 47, 3, 'Panorama');
INSERT INTO `FIPOP`.`camera_shot_type_translation` (`id`, `camera_shot_type_analysis_method_id`, `language_id`, `type`) VALUES (18, 48, 3, 'Totale');
INSERT INTO `FIPOP`.`camera_shot_type_translation` (`id`, `camera_shot_type_analysis_method_id`, `language_id`, `type`) VALUES (19, 49, 3, 'Halbtotale');
INSERT INTO `FIPOP`.`camera_shot_type_translation` (`id`, `camera_shot_type_analysis_method_id`, `language_id`, `type`) VALUES (20, 50, 3, 'Amerikanische');
INSERT INTO `FIPOP`.`camera_shot_type_translation` (`id`, `camera_shot_type_analysis_method_id`, `language_id`, `type`) VALUES (21, 51, 3, 'Halbnahe');
INSERT INTO `FIPOP`.`camera_shot_type_translation` (`id`, `camera_shot_type_analysis_method_id`, `language_id`, `type`) VALUES (22, 52, 3, 'Nahe');
INSERT INTO `FIPOP`.`camera_shot_type_translation` (`id`, `camera_shot_type_analysis_method_id`, `language_id`, `type`) VALUES (23, 53, 3, 'Großaufnahme');
INSERT INTO `FIPOP`.`camera_shot_type_translation` (`id`, `camera_shot_type_analysis_method_id`, `language_id`, `type`) VALUES (24, 54, 3, 'Detail');
COMMIT;

TRUNCATE TABLE `FIPOP`.`camera_vertical_angle`;
-- -----------------------------------------------------
-- Data for table `FIPOP`.`camera_vertical_angle`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`camera_vertical_angle` (`analysis_method_id`, `min_angle`, `max_angle`) VALUES (37, 90, 90);
INSERT INTO `FIPOP`.`camera_vertical_angle` (`analysis_method_id`, `min_angle`, `max_angle`) VALUES (38, 45, 89);
INSERT INTO `FIPOP`.`camera_vertical_angle` (`analysis_method_id`, `min_angle`, `max_angle`) VALUES (39, 1, 44);
INSERT INTO `FIPOP`.`camera_vertical_angle` (`analysis_method_id`, `min_angle`, `max_angle`) VALUES (40, 0, 0);
INSERT INTO `FIPOP`.`camera_vertical_angle` (`analysis_method_id`, `min_angle`, `max_angle`) VALUES (41, -1, -44);
INSERT INTO `FIPOP`.`camera_vertical_angle` (`analysis_method_id`, `min_angle`, `max_angle`) VALUES (42, -45, -89);
INSERT INTO `FIPOP`.`camera_vertical_angle` (`analysis_method_id`, `min_angle`, `max_angle`) VALUES (43, -90, -90);
INSERT INTO `FIPOP`.`camera_vertical_angle` (`analysis_method_id`, `min_angle`, `max_angle`) VALUES (44, 91, 179);
INSERT INTO `FIPOP`.`camera_vertical_angle` (`analysis_method_id`, `min_angle`, `max_angle`) VALUES (45, -91, -179);
INSERT INTO `FIPOP`.`camera_vertical_angle` (`analysis_method_id`, `min_angle`, `max_angle`) VALUES (46, -180, -180);
COMMIT;

TRUNCATE TABLE `FIPOP`.`camera_vertical_angle_translation`;
-- -----------------------------------------------------
-- Data for table `FIPOP`.`camera_vertical_angle_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (1, 37, 1, 'Top Shot');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (2, 38, 1, 'Bird\'s-Eye View');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (3, 39, 1, 'High-Angle Shot');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (4, 40, 1, '(Eye Level)');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (5, 41, 1, 'Low-Angle Shot');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (6, 42, 1, 'Worm\'s-Eye View');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (7, 43, 1, 'Floor Shot');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (8, 44, 1, 'High-Angle upside down');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (9, 45, 1, 'Low-Angle upside down');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (10, 46, 1, 'Eye-Level, upside down');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (11, 37, 2, 'Top Shot');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (12, 38, 2, 'Bird\'s-Eye View');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (13, 39, 2, 'High-Angle Shot');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (14, 40, 2, '(Eye Level)');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (15, 41, 2, 'Low-Angle Shot');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (16, 42, 2, 'Worm\'s-Eye View');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (17, 43, 2, 'Floor Shot');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (18, 44, 2, 'High-Angle upside down');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (19, 45, 2, 'Low-Angle upside down');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (20, 46, 2, 'Eye-Level, upside down');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (21, 37, 3, 'Top Shot');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (22, 38, 3, 'starke Aufsicht (Vogelperspektive)');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (23, 39, 3, 'leichte Aufsicht');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (24, 40, 3, '(Normalhöhe)');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (25, 41, 3, 'leichte Untersicht');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (26, 42, 3, 'starke Untersicht (Froschperspektive)');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (27, 43, 3, 'Floor Shot');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (28, 44, 3, 'Aufsicht Überkopfposition');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (29, 45, 3, 'Untersicht Überkopfposition');
INSERT INTO `FIPOP`.`camera_vertical_angle_translation` (`id`, `camera_vertical_angle_analysis_method_id`, `language_id`, `name`) VALUES (30, 46, 3, 'Normalhöhe, überkopf');
COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`color_temperature`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`color_temperature` (`analysis_method_id`) VALUES (7);
INSERT INTO `FIPOP`.`color_temperature` (`analysis_method_id`) VALUES (8);
INSERT INTO `FIPOP`.`color_temperature` (`analysis_method_id`) VALUES (9);
COMMIT;

-- -----------------------------------------------------
-- Data for table `FIPOP`.`color_temperature_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`color_temperature_translation` (`id`, `language_id`, `color_temperature_analysis_method_id`, `name`) VALUES (1, 1, 7, 'warm white (2700K - 3500K)');
INSERT INTO `FIPOP`.`color_temperature_translation` (`id`, `language_id`, `color_temperature_analysis_method_id`, `name`) VALUES (2, 1, 8, 'neutral white (3500K - 5000K)');
INSERT INTO `FIPOP`.`color_temperature_translation` (`id`, `language_id`, `color_temperature_analysis_method_id`, `name`) VALUES (3, 1, 9, 'cold white (5000K - 6500K)');
COMMIT;

TRUNCATE TABLE `FIPOP`.`martinez_scheffel_unreliable_narration`;
-- -----------------------------------------------------
-- Data for table `FIPOP`.`martinez_scheffel_unreliable_narration`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`martinez_scheffel_unreliable_narration` (`analysis_method_id`) VALUES (1);
INSERT INTO `FIPOP`.`martinez_scheffel_unreliable_narration` (`analysis_method_id`) VALUES (2);
INSERT INTO `FIPOP`.`martinez_scheffel_unreliable_narration` (`analysis_method_id`) VALUES (3);
INSERT INTO `FIPOP`.`martinez_scheffel_unreliable_narration` (`analysis_method_id`) VALUES (4);
INSERT INTO `FIPOP`.`martinez_scheffel_unreliable_narration` (`analysis_method_id`) VALUES (5);
INSERT INTO `FIPOP`.`martinez_scheffel_unreliable_narration` (`analysis_method_id`) VALUES (6);
COMMIT;

TRUNCATE TABLE `FIPOP`.`martinez_scheffel_unreliable_narration_translation`;
-- -----------------------------------------------------
-- Data for table `FIPOP`.`martinez_scheffel_unreliable_narration_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`martinez_scheffel_unreliable_narration_translation` (`id`, `martinez_scheffel_unreliable_narration_analysis_method_id`, `language_id`, `type`) VALUES (1, 1, 1, 'absence of a privileged narrator\'s speech');
INSERT INTO `FIPOP`.`martinez_scheffel_unreliable_narration_translation` (`id`, `martinez_scheffel_unreliable_narration_analysis_method_id`, `language_id`, `type`) VALUES (2, 2, 1, 'logically privileged figure speech');
INSERT INTO `FIPOP`.`martinez_scheffel_unreliable_narration_translation` (`id`, `martinez_scheffel_unreliable_narration_analysis_method_id`, `language_id`, `type`) VALUES (3, 3, 1, 'mimetically partially unreliable narration');
INSERT INTO `FIPOP`.`martinez_scheffel_unreliable_narration_translation` (`id`, `martinez_scheffel_unreliable_narration_analysis_method_id`, `language_id`, `type`) VALUES (4, 4, 1, 'mimetically undecidable narration');
INSERT INTO `FIPOP`.`martinez_scheffel_unreliable_narration_translation` (`id`, `martinez_scheffel_unreliable_narration_analysis_method_id`, `language_id`, `type`) VALUES (5, 5, 1, 'theoretically unreliable narration');
INSERT INTO `FIPOP`.`martinez_scheffel_unreliable_narration_translation` (`id`, `martinez_scheffel_unreliable_narration_analysis_method_id`, `language_id`, `type`) VALUES (6, 6, 1, 'unreliable narration');
INSERT INTO `FIPOP`.`martinez_scheffel_unreliable_narration_translation` (`id`, `martinez_scheffel_unreliable_narration_analysis_method_id`, `language_id`, `type`) VALUES (7, 1, 2, 'absence of a privileged narrator\'s speech');
INSERT INTO `FIPOP`.`martinez_scheffel_unreliable_narration_translation` (`id`, `martinez_scheffel_unreliable_narration_analysis_method_id`, `language_id`, `type`) VALUES (8, 2, 2, 'logically privileged figure speech');
INSERT INTO `FIPOP`.`martinez_scheffel_unreliable_narration_translation` (`id`, `martinez_scheffel_unreliable_narration_analysis_method_id`, `language_id`, `type`) VALUES (9, 3, 2, 'mimetically partially unreliable narration');
INSERT INTO `FIPOP`.`martinez_scheffel_unreliable_narration_translation` (`id`, `martinez_scheffel_unreliable_narration_analysis_method_id`, `language_id`, `type`) VALUES (10, 4, 2, 'mimetically undecidable narration');
INSERT INTO `FIPOP`.`martinez_scheffel_unreliable_narration_translation` (`id`, `martinez_scheffel_unreliable_narration_analysis_method_id`, `language_id`, `type`) VALUES (11, 5, 2, 'theoretically unreliable narration');
INSERT INTO `FIPOP`.`martinez_scheffel_unreliable_narration_translation` (`id`, `martinez_scheffel_unreliable_narration_analysis_method_id`, `language_id`, `type`) VALUES (12, 6, 2, 'unreliable narration');
INSERT INTO `FIPOP`.`martinez_scheffel_unreliable_narration_translation` (`id`, `martinez_scheffel_unreliable_narration_analysis_method_id`, `language_id`, `type`) VALUES (13, 1, 3, 'Fehlen einer privilegierten Erzählerrede');
INSERT INTO `FIPOP`.`martinez_scheffel_unreliable_narration_translation` (`id`, `martinez_scheffel_unreliable_narration_analysis_method_id`, `language_id`, `type`) VALUES (14, 2, 3, 'Logisch privilegierte Figurenrede');
INSERT INTO `FIPOP`.`martinez_scheffel_unreliable_narration_translation` (`id`, `martinez_scheffel_unreliable_narration_analysis_method_id`, `language_id`, `type`) VALUES (15, 3, 3, 'Mimetisch teilweise unzuverlässiges Erzählen');
INSERT INTO `FIPOP`.`martinez_scheffel_unreliable_narration_translation` (`id`, `martinez_scheffel_unreliable_narration_analysis_method_id`, `language_id`, `type`) VALUES (16, 4, 3, 'Mimetisch unentscheidbares Erzählen');
INSERT INTO `FIPOP`.`martinez_scheffel_unreliable_narration_translation` (`id`, `martinez_scheffel_unreliable_narration_analysis_method_id`, `language_id`, `type`) VALUES (17, 5, 3, 'Theoretisch unzuverlässiges Erzählen');
INSERT INTO `FIPOP`.`martinez_scheffel_unreliable_narration_translation` (`id`, `martinez_scheffel_unreliable_narration_analysis_method_id`, `language_id`, `type`) VALUES (18, 6, 3, 'Unzuverlässiges Erzählen');
COMMIT;

TRUNCATE TABLE `FIPOP`.`zelizer_beese_voice_of_the_visual`;
-- -----------------------------------------------------
-- Data for table `FIPOP`.`zelizer_beese_voice_of_the_visual`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`zelizer_beese_voice_of_the_visual` (`analysis_method_id`) VALUES (66);
INSERT INTO `FIPOP`.`zelizer_beese_voice_of_the_visual` (`analysis_method_id`) VALUES (67);
INSERT INTO `FIPOP`.`zelizer_beese_voice_of_the_visual` (`analysis_method_id`) VALUES (68);
COMMIT;

TRUNCATE TABLE `FIPOP`.`zelizer_beese_voice_of_the_visual_translation`;
-- -----------------------------------------------------
-- Data for table `FIPOP`.`zelizer_beese_voice_of_the_visual_translation`
-- -----------------------------------------------------
START TRANSACTION;
USE `FIPOP`;
INSERT INTO `FIPOP`.`zelizer_beese_voice_of_the_visual_translation` (`id`, `zelizer_beese_voice_of_the_visual_analysis_method_id`, `language_id`, `type`) VALUES (1, 66, 1, 'conjunctive');
INSERT INTO `FIPOP`.`zelizer_beese_voice_of_the_visual_translation` (`id`, `zelizer_beese_voice_of_the_visual_analysis_method_id`, `language_id`, `type`) VALUES (2, 67, 1, 'indicative');
INSERT INTO `FIPOP`.`zelizer_beese_voice_of_the_visual_translation` (`id`, `zelizer_beese_voice_of_the_visual_analysis_method_id`, `language_id`, `type`) VALUES (3, 68, 1, 'subjunctive');
INSERT INTO `FIPOP`.`zelizer_beese_voice_of_the_visual_translation` (`id`, `zelizer_beese_voice_of_the_visual_analysis_method_id`, `language_id`, `type`) VALUES (4, 66, 2, 'conjunctive');
INSERT INTO `FIPOP`.`zelizer_beese_voice_of_the_visual_translation` (`id`, `zelizer_beese_voice_of_the_visual_analysis_method_id`, `language_id`, `type`) VALUES (5, 67, 2, 'indicative');
INSERT INTO `FIPOP`.`zelizer_beese_voice_of_the_visual_translation` (`id`, `zelizer_beese_voice_of_the_visual_analysis_method_id`, `language_id`, `type`) VALUES (6, 68, 2, 'subjunctive');
INSERT INTO `FIPOP`.`zelizer_beese_voice_of_the_visual_translation` (`id`, `zelizer_beese_voice_of_the_visual_analysis_method_id`, `language_id`, `type`) VALUES (7, 66, 3, 'Konjunktiv');
INSERT INTO `FIPOP`.`zelizer_beese_voice_of_the_visual_translation` (`id`, `zelizer_beese_voice_of_the_visual_analysis_method_id`, `language_id`, `type`) VALUES (8, 67, 3, 'Indikativ');
INSERT INTO `FIPOP`.`zelizer_beese_voice_of_the_visual_translation` (`id`, `zelizer_beese_voice_of_the_visual_analysis_method_id`, `language_id`, `type`) VALUES (9, 68, 3, 'Subjunktiv');
COMMIT;