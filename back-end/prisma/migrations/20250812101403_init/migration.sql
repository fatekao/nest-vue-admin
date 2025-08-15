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
    `role_name` VARCHAR(191) NULL,
    `role_key` VARCHAR(191) NULL,
    `status` INTEGER NULL DEFAULT 0,
    `is_deleted` BOOLEAN NULL DEFAULT false,
    `remark` VARCHAR(191) NULL,
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_time` DATETIME(3) NULL,
    `create_by` INTEGER NULL,
    `update_by` INTEGER NULL,

    UNIQUE INDEX `sys_role_role_name_key`(`role_name`),
    UNIQUE INDEX `sys_role_role_key_key`(`role_key`),
    PRIMARY KEY (`role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_menu` (
    `menu_id` INTEGER NOT NULL AUTO_INCREMENT,
    `menu_name` VARCHAR(191) NOT NULL,
    `parent_id` INTEGER NULL DEFAULT 0,
    `path` VARCHAR(191) NULL,
    `component` VARCHAR(191) NULL,
    `icon` VARCHAR(191) NULL,
    `order_num` INTEGER NULL DEFAULT 0,
    `is_visible` BOOLEAN NULL DEFAULT true,
    `is_cacheable` BOOLEAN NULL DEFAULT true,
    `is_deleted` BOOLEAN NULL DEFAULT false,
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_time` DATETIME(3) NULL,
    `create_by` INTEGER NULL,
    `update_by` INTEGER NULL,

    PRIMARY KEY (`menu_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SysRoleToSysUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_SysRoleToSysUser_AB_unique`(`A`, `B`),
    INDEX `_SysRoleToSysUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SysMenuToSysRole` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_SysMenuToSysRole_AB_unique`(`A`, `B`),
    INDEX `_SysMenuToSysRole_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sys_menu` ADD CONSTRAINT `sys_menu_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `sys_menu`(`menu_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SysRoleToSysUser` ADD CONSTRAINT `_SysRoleToSysUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `sys_role`(`role_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SysRoleToSysUser` ADD CONSTRAINT `_SysRoleToSysUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `sys_user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SysMenuToSysRole` ADD CONSTRAINT `_SysMenuToSysRole_A_fkey` FOREIGN KEY (`A`) REFERENCES `sys_menu`(`menu_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SysMenuToSysRole` ADD CONSTRAINT `_SysMenuToSysRole_B_fkey` FOREIGN KEY (`B`) REFERENCES `sys_role`(`role_id`) ON DELETE CASCADE ON UPDATE CASCADE;
