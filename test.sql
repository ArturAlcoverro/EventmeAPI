CREATE TABLE `eventme`.`users` (
    `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT , 
    `image` VARCHAR(255) NULL , 
    `name` VARCHAR(255) NOT NULL , 
    `full_name` VARCHAR(255) NOT NULL , 
    `email` VARCHAR(255) NOT NULL UNIQUE, 
    `password` VARCHAR(255) NOT NULL, 
    PRIMARY KEY (`id`) ) ;

CREATE TABLE `eventme`.`events` ( 
    `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT, 
    `name` VARCHAR(255) NOT NULL , 
    `owner_id` INT(10) UNSIGNED NOT NULL , 
    `date` DATE NOT NULL , 
    `image` VARCHAR(255) NULL , 
    `location` VARCHAR(255) NOT NULL , 
    `description` TEXT NULL , 
    `eventStart_date` DATE NOT NULL , 
    `eventEnd_date` DATE NOT NULL , 
    `n_participators` INT(10) UNSIGNED NOT NULL , 
    `type` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`owner_id`) REFERENCES users(`id`));

CREATE TABLE `eventme`.`assistance` ( 
    `user_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT, 
    `event_id` INT(10) UNSIGNED NOT NULL  , 
    `puntuation` INT(1) UNSIGNED NOT NULL , 
    `comentary` TEXT NULL ,
    PRIMARY KEY (`user_id`, `event_id`),
    FOREIGN KEY (`user_id`) REFERENCES users(`id`),
    FOREIGN KEY (`event_id`) REFERENCES events(`id`),
    CHECK (`puntuation` IN (1,2,3,4,5)));

CREATE TABLE `eventme`.`friends` ( 
    `user_id` INT(10) UNSIGNED NOT NULL, 
    `user_id_friend` INT(10) UNSIGNED NOT NULL, 
    `status` INT(2) NOT NULL  , 
    PRIMARY KEY (`user_id`, `user_id_friend`),
    FOREIGN KEY (`user_id`) REFERENCES users(`id`),
    FOREIGN KEY (`user_id_friend`) REFERENCES users(`id`));

CREATE TABLE `eventme`.`messages` (
    `id` INT(16) UNSIGNED NOT NULL AUTO_INCREMENT, 
    `content` TEXT NOT NULL,
    `user_id_send` INT(10) UNSIGNED NOT NULL, 
    `user_id_recived` INT(10) UNSIGNED NOT NULL, 
    `time_stamp` DATETIME NOT NULL, 
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id_send`) REFERENCES users(`id`),
    FOREIGN KEY (`user_id_recived`) REFERENCES users(`id`));