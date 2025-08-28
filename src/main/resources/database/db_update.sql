/**
 * The execution of this script is necessary if an already running instance of TIMAAT is to be updated to the latest
 * version and a database update has occurred in this version.
 * The required database schema version is documented within the README. The schema version currently installed on the database
 * can be read in the db_version table. If this table is not available, this is the initial schema version, which must be updated in any case.
 *
 * IMPORTANT: Please make a backup of your database before executing this update script!
 */
DELIMITER $$
CREATE PROCEDURE update_to_0_14_0()
BEGIN
    DECLARE database_name VARCHAR(64) DEFAULT 'FIPOP';
    DECLARE db_version_table_name VARCHAR(64) DEFAULT 'db_version';
    DECLARE db_version_exists INT DEFAULT 0;

    SELECT COUNT(*)
    INTO db_version_exists
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = database_name
      AND TABLE_NAME = db_version_table_name;

    IF db_version_exists = 0 THEN
        SELECT 'execute update to 0.14.0' AS log_message;
        CREATE TABLE `FIPOP`.`db_version`
        (
            `major_version` INT       NOT NULL,
            `minor_version` INT       NOT NULL,
            `patch_version` INT       NOT NULL,
            `created_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`major_version`, `minor_version`, `patch_version`)
        )
            ENGINE = InnoDB;

        CREATE TABLE `FIPOP`.`audio_analysis`
        (
            `id`                         INT           NOT NULL AUTO_INCREMENT,
            `audio_codec`                VARCHAR(45)   NOT NULL,
            `channels`                   int           NOT NULL,
            `sample_rate`                int           NOT NULL,
            `bitrate`                    int           NOT NULL,
            `sample_count`               bigint        NOT NULL,
            `waveform_path`              varchar(4000) NOT NULL,
            `frequency_information_path` varchar(4000) NOT NULL,
            PRIMARY KEY (`id`)
        )
            ENGINE = InnoDB;

        CREATE TABLE `FIPOP`.`audio_analysis_state`
        (
            `id` INT NOT NULL AUTO_INCREMENT,
            PRIMARY KEY (`id`)
        )
            ENGINE = InnoDB;

        CREATE TABLE `FIPOP`.`audio_analysis_state_translation`
        (
            `id`                      INT         NOT NULL AUTO_INCREMENT,
            `audio_analysis_state_id` INT         NOT NULL,
            `language_id`             INT         NOT NULL,
            `state`                   VARCHAR(45) NOT NULL,
            PRIMARY KEY (`id`),
            CONSTRAINT `fk_audio_analysis_state_translation_audio_analysis_state1`
                FOREIGN KEY (`audio_analysis_state_id`)
                    REFERENCES `FIPOP`.`audio_analysis_state` (`id`)
                    ON DELETE CASCADE
                    ON UPDATE NO ACTION,
            CONSTRAINT `fk_audio_analysis_state_translation_language`
                FOREIGN KEY (`language_id`)
                    REFERENCES `FIPOP`.`language` (`id`)
                    ON DELETE CASCADE
                    ON UPDATE NO ACTION
        )
            ENGINE = InnoDB;
        CREATE INDEX fk_audio_analysis_state_translation_audio_analysis_state1_idx ON `FIPOP`.`audio_analysis_state_translation` (audio_analysis_state_id asc);
        CREATE INDEX fk_audio_analysis_state_translation_language ON `FIPOP`.`audio_analysis_state_translation` (language_id);

        CREATE TABLE `FIPOP`.`medium_audio_analysis`
        (
            `medium_id`               INT NOT NULL PRIMARY KEY,
            `audio_analysis_state_id` INT NOT NULL,
            `audio_analysis_id`       INT,
            CONSTRAINT `fk_medium_audio_analysis_medium1`
                FOREIGN KEY (`medium_id`)
                    REFERENCES `FIPOP`.`medium` (`id`)
                    ON DELETE CASCADE
                    ON UPDATE NO ACTION,
            CONSTRAINT `fk_medium_audio_analysis_audio_analysis_state1`
                FOREIGN KEY (`audio_analysis_state_id`)
                    REFERENCES `FIPOP`.`audio_analysis_state` (`id`)
                    ON DELETE CASCADE
                    ON UPDATE NO ACTION,
            CONSTRAINT `fk_medium_audio_analysis_audio_analysis1`
                FOREIGN KEY (`audio_analysis_id`)
                    REFERENCES `FIPOP`.`audio_analysis` (`id`)
                    ON DELETE SET NULL
                    ON UPDATE NO ACTION
        )
            ENGINE = InnoDB;
        CREATE INDEX fk_medium_audio_analysis_medium1_idx ON `FIPOP`.`medium_audio_analysis` (medium_id ASC);
        CREATE INDEX fk_medium_audio_analysis_audio_analysis_state1_idx ON `FIPOP`.`medium_audio_analysis` (audio_analysis_state_id ASC);
        CREATE INDEX fk_medium_audio_analysis_audio_analysis1_idx ON `FIPOP`.`medium_audio_analysis` (audio_analysis_id ASC);

        START TRANSACTION;
        INSERT INTO `FIPOP`.`db_version` (major_version, minor_version, patch_version) VALUES (0, 14, 0);
        COMMIT;

        START TRANSACTION;
        INSERT INTO `FIPOP`.`audio_analysis_state` (`id`)
        VALUES (1);
        INSERT INTO `FIPOP`.`audio_analysis_state` (`id`)
        VALUES (2);
        INSERT INTO `FIPOP`.`audio_analysis_state` (`id`)
        VALUES (3);
        INSERT INTO `FIPOP`.`audio_analysis_state` (`id`)
        VALUES (4);
        COMMIT;

        START TRANSACTION;
        INSERT INTO `FIPOP`.`audio_analysis_state_translation` (audio_analysis_state_id, language_id, state)
        VALUES (1, 1, 'pending');
        INSERT INTO `FIPOP`.`audio_analysis_state_translation` (audio_analysis_state_id, language_id, state)
        VALUES (2, 1, 'running');
        INSERT INTO `FIPOP`.`audio_analysis_state_translation` (audio_analysis_state_id, language_id, state)
        VALUES (3, 1, 'failed');
        INSERT INTO `FIPOP`.`audio_analysis_state_translation` (audio_analysis_state_id, language_id, state)
        VALUES (4, 1, 'done');
        COMMIT;

        START TRANSACTION;
        INSERT INTO `FIPOP`.`medium_audio_analysis` (medium_id, audio_analysis_state_id)
        SELECT id, 1
        FROM medium
        where media_type_id in (1, 6);
        COMMIT;

        # TODO: Remove audio_codec_information and referencing columns on medium_audio and medium_video
        ALTER TABLE medium_audio
            DROP FOREIGN KEY fk_medium_audio_audio_codec_information1;
        ALTER TABLE medium_audio
            DROP COLUMN audio_codec_information_id;
        ALTER TABLE medium_video
            DROP FOREIGN KEY fk_medium_video_audio_codec_information1;
        ALTER TABLE medium_video
            DROP COLUMN audio_codec_information_id;

        DROP TABLE audio_codec_information;

        SELECT 'finished update to 0.14.0' AS log_message;
    END IF;
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE update_to_0_14_1()
BEGIN
    DECLARE db_major_version int;
    DECLARE db_minor_version int;
    DECLARE db_patch_version int;

    SELECT major_version, minor_version, patch_version
    INTO db_major_version, db_minor_version, db_patch_version
    FROM db_version
    LIMIT 1;

    IF db_major_version = 0 AND db_minor_version = 14 AND db_patch_version = 0 THEN
        SELECT 'execute update to 0.14.1' AS log_message;
        DELETE FROM db_version;
        INSERT INTO db_version (major_version, minor_version, patch_version) VALUES (0, 14, 1);

        CREATE TABLE `FIPOP`.`music_translation`
        (
            `music_id`    INT NOT NULL,
            `language_id` INT NOT NULL,
            `translation` TEXT,
            CONSTRAINT `fk_music_translation_music1`
                FOREIGN KEY (`music_id`)
                    REFERENCES `FIPOP`.`music` (`id`)
                    ON DELETE CASCADE
                    ON UPDATE NO ACTION,
            CONSTRAINT `fk_music_translation_language1`
                FOREIGN KEY (`language_id`)
                    REFERENCES `FIPOP`.`language` (`id`)
                    ON DELETE CASCADE
                    ON UPDATE NO ACTION,
            CONSTRAINT `pk_music_translation1` PRIMARY KEY (music_id, language_id)
        ) ENGINE = InnoDB;
        CREATE INDEX fk_music_translation_music1_idx ON `FIPOP`.`music_translation` (music_id ASC);
        CREATE INDEX fk_music_translation_language1_idx ON `FIPOP`.`music_translation` (language_id ASC);

        SELECT 'finished update to 0.14.1' AS log_message;
    END IF;
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE update_to_0_14_2()
BEGIN
    DECLARE db_major_version int;
    DECLARE db_minor_version int;
    DECLARE db_patch_version int;

    SELECT major_version, minor_version, patch_version
    INTO db_major_version, db_minor_version, db_patch_version
    FROM db_version
    LIMIT 1;

    IF db_major_version = 0 AND db_minor_version = 14 AND db_patch_version = 1 THEN
        SELECT 'execute update to 0.14.2' AS log_message;
        DELETE FROM db_version;
        INSERT INTO db_version (major_version, minor_version, patch_version) VALUES (0, 14, 2);

        CREATE TABLE `FIPOP`.`annotation_has_music`
        (
            `music_id`    INT NOT NULL,
            `annotation_id` INT NOT NULL,
            CONSTRAINT `fk_annotation_has_music_music1`
                FOREIGN KEY (`music_id`)
                    REFERENCES `FIPOP`.`music` (`id`)
                    ON DELETE CASCADE
                    ON UPDATE NO ACTION,
            CONSTRAINT `fk_annotation_has_music_annotation1`
                FOREIGN KEY (`annotation_id`)
                    REFERENCES `FIPOP`.`annotation` (`id`)
                    ON DELETE CASCADE
                    ON UPDATE NO ACTION,
            CONSTRAINT `pk_annotation_has_music1` PRIMARY KEY (music_id, annotation_id)
        ) ENGINE = InnoDB;
        CREATE INDEX fk_annotation_has_music_music1_idx ON `FIPOP`.`annotation_has_music` (music_id ASC);
        CREATE INDEX fk_annotation_has_music_annotation1_idx ON `FIPOP`.`annotation_has_music` (annotation_id ASC);

        SELECT 'finished update to 0.14.2' AS log_message;
    END IF;
END $$
DELIMITER ;
/**
 * Call update functions
 */
CALL update_to_0_14_0();
CALL update_to_0_14_1();
CALL update_to_0_14_2();

/*
 * Delete update functions after finishing update script
 */
DROP PROCEDURE update_to_0_14_0;
DROP PROCEDURE update_to_0_14_1;
DROP PROCEDURE update_to_0_14_2;