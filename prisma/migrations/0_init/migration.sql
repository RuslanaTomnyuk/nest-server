-- CreateTable
CREATE TABLE `job_position` (
    `company` VARCHAR(255) NOT NULL,
    `logo` VARCHAR(255) NOT NULL,
    `newPosition` TINYINT NOT NULL,
    `featured` TINYINT NOT NULL,
    `position` VARCHAR(255) NOT NULL,
    `role` VARCHAR(255) NOT NULL,
    `level` VARCHAR(255) NOT NULL,
    `postedAt` VARCHAR(255) NOT NULL,
    `contract` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `languages` TEXT NOT NULL,
    `tools` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role` (
    `name` VARCHAR(255) NOT NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_users_user` (
    `roleId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    INDEX `IDX_a88fcb405b56bf2e2646e9d479`(`userId`),
    INDEX `IDX_ed6edac7184b013d4bd58d60e5`(`roleId`),
    PRIMARY KEY (`roleId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `passwordChangeAt` DATETIME(0) NULL,
    `passwordResetToken` VARCHAR(255) NULL,
    `passwordResetTokenExpires` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_roles_role` (
    `userId` INTEGER NOT NULL,
    `roleId` INTEGER NOT NULL,

    INDEX `IDX_4be2f7adf862634f5f803d246b`(`roleId`),
    INDEX `IDX_5f9286e6c25594c6b88c108db7`(`userId`),
    PRIMARY KEY (`userId`, `roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_token` (
    `token` VARCHAR(255) NOT NULL,
    `userId` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `role_users_user` ADD CONSTRAINT `FK_a88fcb405b56bf2e2646e9d4797` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `role_users_user` ADD CONSTRAINT `FK_ed6edac7184b013d4bd58d60e54` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_roles_role` ADD CONSTRAINT `FK_4be2f7adf862634f5f803d246b8` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_roles_role` ADD CONSTRAINT `FK_5f9286e6c25594c6b88c108db77` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

