SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='';

ALTER TABLE `FIPOP`.`selector_svg` CHANGE `color_rgba` `color_hex` VARCHAR(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL;
ALTER TABLE `FIPOP`.`selector_svg` ADD `opacity` TINYINT NOT NULL DEFAULT '30' AFTER `color_hex`;

SET SQL_MODE=@OLD_SQL_MODE;