/*
  Warnings:

  - You are about to alter the column `name` on the `sys_permission` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `type` on the `sys_permission` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.
  - You are about to alter the column `icon` on the `sys_permission` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `permission` on the `sys_permission` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `order_num` on the `sys_permission` table. The data in that column could be lost. The data in that column will be cast from `Int` to `SmallInt`.
  - You are about to alter the column `name` on the `sys_role` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `key` on the `sys_role` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `status` on the `sys_role` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.
  - You are about to alter the column `username` on the `sys_user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `nick_name` on the `sys_user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `gender` on the `sys_user` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.
  - You are about to alter the column `email` on the `sys_user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `phone` on the `sys_user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - You are about to alter the column `status` on the `sys_user` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.
  - You are about to alter the column `last_login_ip` on the `sys_user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(45)`.

*/
-- AlterTable
ALTER TABLE `sys_permission` MODIFY `name` VARCHAR(100) NOT NULL,
    MODIFY `type` TINYINT NOT NULL DEFAULT 0,
    MODIFY `path` VARCHAR(200) NULL,
    MODIFY `component` VARCHAR(200) NULL,
    MODIFY `icon` VARCHAR(100) NULL,
    MODIFY `permission` VARCHAR(100) NULL,
    MODIFY `order_num` SMALLINT NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `sys_role` MODIFY `name` VARCHAR(50) NULL,
    MODIFY `key` VARCHAR(50) NULL,
    MODIFY `status` TINYINT NULL DEFAULT 0,
    MODIFY `remark` TEXT NULL;

-- AlterTable
ALTER TABLE `sys_user` MODIFY `username` VARCHAR(50) NOT NULL,
    MODIFY `password` VARCHAR(255) NOT NULL,
    MODIFY `nick_name` VARCHAR(50) NOT NULL,
    MODIFY `gender` TINYINT NULL DEFAULT 1,
    MODIFY `email` VARCHAR(100) NULL,
    MODIFY `phone` VARCHAR(20) NULL,
    MODIFY `avatar` VARCHAR(500) NULL,
    MODIFY `status` TINYINT NULL DEFAULT 1,
    MODIFY `last_login_ip` VARCHAR(45) NULL,
    MODIFY `remark` TEXT NULL;

-- CreateTable
CREATE TABLE `sys_oper_log` (
    `oper_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NOT NULL,
    `business_type` TINYINT NOT NULL DEFAULT 0,
    `method` VARCHAR(100) NULL,
    `request_method` VARCHAR(10) NULL,
    `operator_type` TINYINT NOT NULL DEFAULT 1,
    `oper_name` VARCHAR(50) NULL,
    `dept_name` VARCHAR(50) NULL,
    `oper_url` VARCHAR(255) NULL,
    `oper_ip` VARCHAR(45) NULL,
    `oper_location` VARCHAR(255) NULL,
    `oper_param` TEXT NULL,
    `json_result` TEXT NULL,
    `status` TINYINT NOT NULL DEFAULT 0,
    `error_msg` TEXT NULL,
    `oper_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cost_time` INTEGER NOT NULL DEFAULT 0,

    INDEX `idx_oper_time`(`oper_time`),
    INDEX `idx_oper_name`(`oper_name`),
    INDEX `idx_business_type`(`business_type`),
    PRIMARY KEY (`oper_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_login_log` (
    `info_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_name` VARCHAR(50) NULL,
    `ipaddr` VARCHAR(45) NULL,
    `login_location` VARCHAR(255) NULL,
    `browser` VARCHAR(50) NULL,
    `os` VARCHAR(50) NULL,
    `status` CHAR(1) NOT NULL,
    `msg` VARCHAR(255) NULL,
    `login_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_login_user_name`(`user_name`),
    INDEX `idx_login_time`(`login_time`),
    INDEX `idx_login_status`(`status`),
    PRIMARY KEY (`info_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `idx_permission_type_deleted` ON `sys_permission`(`type`, `is_deleted`);

-- CreateIndex
CREATE INDEX `idx_permission_order_parent` ON `sys_permission`(`order_num`, `parent_id`);

-- CreateIndex
CREATE INDEX `idx_permission_visible_type` ON `sys_permission`(`is_visible`, `type`);

-- CreateIndex
CREATE INDEX `idx_role_status_deleted` ON `sys_role`(`status`, `is_deleted`);

-- CreateIndex
CREATE INDEX `idx_user_status_deleted` ON `sys_user`(`status`, `is_deleted`);

-- CreateIndex
CREATE INDEX `idx_user_create_time` ON `sys_user`(`create_time`);

-- CreateIndex
CREATE INDEX `idx_user_last_login` ON `sys_user`(`last_login_time`);
