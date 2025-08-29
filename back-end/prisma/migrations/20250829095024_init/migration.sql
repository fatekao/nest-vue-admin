-- CreateTable
CREATE TABLE `sys_user` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nick_name` VARCHAR(191) NOT NULL,
    `gender` INTEGER NULL DEFAULT 1,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `avatar` VARCHAR(191) NULL,
    `status` INTEGER NULL DEFAULT 1,
    `is_deleted` BOOLEAN NULL DEFAULT false,
    `last_login_ip` VARCHAR(191) NULL,
    `last_login_time` DATETIME(3) NULL,
    `remark` VARCHAR(191) NULL,
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_time` DATETIME(3) NULL,
    `create_by` INTEGER NULL,
    `update_by` INTEGER NULL,

    UNIQUE INDEX `sys_user_username_key`(`username`),
    UNIQUE INDEX `sys_user_email_key`(`email`),
    UNIQUE INDEX `sys_user_phone_key`(`phone`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_role` (
    `role_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `key` VARCHAR(191) NULL,
    `status` INTEGER NULL DEFAULT 0,
    `is_deleted` BOOLEAN NULL DEFAULT false,
    `remark` VARCHAR(191) NULL,
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_time` DATETIME(3) NULL,
    `create_by` INTEGER NULL,
    `update_by` INTEGER NULL,

    UNIQUE INDEX `sys_role_name_key`(`name`),
    UNIQUE INDEX `sys_role_key_key`(`key`),
    PRIMARY KEY (`role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_permission` (
    `permission_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` INTEGER NOT NULL DEFAULT 0,
    `parent_id` INTEGER NULL DEFAULT 0,
    `path` VARCHAR(191) NULL,
    `component` VARCHAR(191) NULL,
    `icon` VARCHAR(191) NULL,
    `permission` VARCHAR(191) NULL,
    `order_num` INTEGER NOT NULL DEFAULT 0,
    `is_visible` BOOLEAN NOT NULL DEFAULT true,
    `is_cacheable` BOOLEAN NOT NULL DEFAULT true,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_time` DATETIME(3) NULL,
    `create_by` INTEGER NULL,
    `update_by` INTEGER NULL,

    UNIQUE INDEX `sys_permission_permission_key`(`permission`),
    INDEX `idx_parent_id`(`parent_id`),
    PRIMARY KEY (`permission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SysRoleToSysUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_SysRoleToSysUser_AB_unique`(`A`, `B`),
    INDEX `_SysRoleToSysUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SysPermissionToSysRole` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_SysPermissionToSysRole_AB_unique`(`A`, `B`),
    INDEX `_SysPermissionToSysRole_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sys_permission` ADD CONSTRAINT `sys_permission_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `sys_permission`(`permission_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `_SysRoleToSysUser` ADD CONSTRAINT `_SysRoleToSysUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `sys_role`(`role_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SysRoleToSysUser` ADD CONSTRAINT `_SysRoleToSysUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `sys_user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SysPermissionToSysRole` ADD CONSTRAINT `_SysPermissionToSysRole_A_fkey` FOREIGN KEY (`A`) REFERENCES `sys_permission`(`permission_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SysPermissionToSysRole` ADD CONSTRAINT `_SysPermissionToSysRole_B_fkey` FOREIGN KEY (`B`) REFERENCES `sys_role`(`role_id`) ON DELETE CASCADE ON UPDATE CASCADE;
