ALTER TABLE `FIPOP`.`analysis_speech` CHANGE `accent` `accent` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL;
ALTER TABLE `FIPOP`.`analysis_speech` CHANGE `intonation` `intonation` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL;
ALTER TABLE `FIPOP`.`analysis_speech` CHANGE `volume` `volume` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL;
ALTER TABLE `FIPOP`.`analysis_speech` CHANGE `speech_tempo` `tempo` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL;
ALTER TABLE `FIPOP`.`analysis_speech` CHANGE `pauses` `pauses` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL;
ALTER TABLE `FIPOP`.`analysis_speech` CHANGE `timbre` `timbre` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL;

ALTER TABLE `FIPOP`.`audio_post_production` ADD `dummy` TINYINT(1) NULL;

ALTER TABLE `FIPOP`.`audio_post_production_translation` CHANGE `overdubbing` `overdubbing` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL;
ALTER TABLE `FIPOP`.`audio_post_production_translation` CHANGE `reverb` `reverb` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL;
ALTER TABLE `FIPOP`.`audio_post_production_translation` CHANGE `delay` `delay` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL;
ALTER TABLE `FIPOP`.`audio_post_production_translation` CHANGE `panning` `panning` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL;
ALTER TABLE `FIPOP`.`audio_post_production_translation` CHANGE `bass` `bass` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL;
ALTER TABLE `FIPOP`.`audio_post_production_translation` CHANGE `treble` `treble` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL;