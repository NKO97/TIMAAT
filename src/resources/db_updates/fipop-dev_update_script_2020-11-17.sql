START TRANSACTION;
USE `FIPOP`;
DELETE FROM `fipop`.`analysis_method_type_translation` WHERE  `id`=2;
DELETE FROM `fipop`.`analysis_method_type_translation` WHERE  `id`=4;
COMMIT;

START TRANSACTION;
USE `FIPOP`;
DELETE FROM `fipop`.`analysis_method_type` WHERE  `id`=2;
DELETE FROM `fipop`.`analysis_method_type` WHERE  `id`=4;
COMMIT;