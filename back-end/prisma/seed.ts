import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('开始初始化种子数据...');

  // 1. 创建超级管理员用户（需要先创建，因为其他实体的审计字段需要关联到它）
  const hashedPassword = await bcrypt.hash('Admin123!', 10);

  const adminUser = await prisma.sysUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      nickName: '超级管理员',
      gender: 1, // 男性
      email: 'admin@example.com',
      phone: '13800000000',
      status: 1, // 正常状态
      isDeleted: false,
      remark: '系统超级管理员账号',
      // 审计字段，自身作为创建者和更新者
      createBy: 1, // 初始值，创建后会更新
      updateBy: 1, // 初始值，创建后会更新
    },
  });

  // 更新超级管理员用户的审计字段，使其指向自身
  await prisma.sysUser.update({
    where: { id: adminUser.id },
    data: {
      createBy: adminUser.id,
      updateBy: adminUser.id,
    },
  });

  console.log('✅ 超级管理员用户创建成功:', adminUser);

  // 2. 创建超级管理员角色
  const adminRole = await prisma.sysRole.upsert({
    where: { key: 'admin' },
    update: {},
    create: {
      name: '超级管理员',
      key: 'admin',
      status: 0, // 正常状态
      isDeleted: false,
      remark: '超级管理员角色，拥有所有权限',
      // 审计字段
      createBy: adminUser.id,
      updateBy: adminUser.id,
    },
  });

  console.log('✅ 超级管理员角色创建成功:', adminRole);

  // 3. 创建普通用户角色
  const userRole = await prisma.sysRole.upsert({
    where: { key: 'user' },
    update: {},
    create: {
      name: '普通用户',
      key: 'user',
      status: 0, // 正常状态
      isDeleted: false,
      remark: '普通用户角色',
      // 审计字段
      createBy: adminUser.id,
      updateBy: adminUser.id,
    },
  });

  console.log('✅ 普通用户角色创建成功:', userRole);

  // 4. 为超级管理员用户分配超级管理员角色
  await prisma.sysUser.update({
    where: { id: adminUser.id },
    data: {
      roles: {
        connect: { id: adminRole.id },
      },
    },
  });

  console.log('✅ 超级管理员用户角色分配成功');

  // 5. 创建系统管理目录
  const systemDir = await prisma.sysPermission.upsert({
    where: { permission: 'system' },
    update: {},
    create: {
      name: '系统管理',
      type: 0, // 目录
      parentId: null, // 顶级目录，父ID为null
      path: '/system',
      icon: 'system',
      permission: 'system',
      orderNum: 1,
      isVisible: true,
      isCacheable: true,
      isDeleted: false,
      // 审计字段
      createBy: adminUser.id,
      updateBy: adminUser.id,
    },
  });

  console.log('✅ 系统管理目录创建成功:', systemDir);

  // 6. 创建用户管理菜单
  const userMenu = await prisma.sysPermission.upsert({
    where: { permission: 'system:user:page' },
    update: {},
    create: {
      name: '用户管理',
      type: 1, // 菜单
      parentId: systemDir.id,
      path: '/system/user',
      component: 'system/user/index',
      icon: 'user',
      permission: 'system:user:page',
      orderNum: 1,
      isVisible: true,
      isCacheable: true,
      isDeleted: false,
      // 审计字段
      createBy: adminUser.id,
      updateBy: adminUser.id,
    },
  });

  console.log('✅ 用户管理菜单创建成功:', userMenu);

  // 7. 创建用户管理相关按钮权限
  const userPermissions = [
    { name: '用户查询', permission: 'system:user:list', orderNum: 1 },
    { name: '用户新增', permission: 'system:user:add', orderNum: 2 },
    { name: '用户修改', permission: 'system:user:edit', orderNum: 3 },
    { name: '用户删除', permission: 'system:user:remove', orderNum: 4 },
    { name: '重置密码', permission: 'system:user:resetPwd', orderNum: 5 },
  ];

  for (const perm of userPermissions) {
    await prisma.sysPermission.upsert({
      where: { permission: perm.permission },
      update: {},
      create: {
        name: perm.name,
        type: 2, // 按钮
        parentId: userMenu.id,
        permission: perm.permission,
        orderNum: perm.orderNum,
        isVisible: false,
        isCacheable: false,
        isDeleted: false,
        // 审计字段
        createBy: adminUser.id,
        updateBy: adminUser.id,
      },
    });
  }

  console.log('✅ 用户管理按钮权限创建成功');

  // 8. 创建角色管理菜单
  const roleMenu = await prisma.sysPermission.upsert({
    where: { permission: 'system:role:page' },
    update: {},
    create: {
      name: '角色管理',
      type: 1, // 菜单
      parentId: systemDir.id,
      path: '/system/role',
      component: 'system/role/index',
      icon: 'peoples',
      permission: 'system:role:page',
      orderNum: 2,
      isVisible: true,
      isCacheable: true,
      isDeleted: false,
      // 审计字段
      createBy: adminUser.id,
      updateBy: adminUser.id,
    },
  });

  console.log('✅ 角色管理菜单创建成功:', roleMenu);

  // 9. 创建角色管理相关按钮权限
  const rolePermissions = [
    { name: '角色查询', permission: 'system:role:list', orderNum: 1 },
    { name: '角色新增', permission: 'system:role:add', orderNum: 2 },
    { name: '角色修改', permission: 'system:role:edit', orderNum: 3 },
    { name: '角色删除', permission: 'system:role:remove', orderNum: 4 },
    { name: '分配权限', permission: 'system:role:auth', orderNum: 5 },
  ];

  for (const perm of rolePermissions) {
    await prisma.sysPermission.upsert({
      where: { permission: perm.permission },
      update: {},
      create: {
        name: perm.name,
        type: 2, // 按钮
        parentId: roleMenu.id,
        permission: perm.permission,
        orderNum: perm.orderNum,
        isVisible: false,
        isCacheable: false,
        isDeleted: false,
        // 审计字段
        createBy: adminUser.id,
        updateBy: adminUser.id,
      },
    });
  }

  console.log('✅ 角色管理按钮权限创建成功');

  // 10. 创建菜单管理菜单
  const menuMenu = await prisma.sysPermission.upsert({
    where: { permission: 'system:menu:page' },
    update: {},
    create: {
      name: '菜单管理',
      type: 1, // 菜单
      parentId: systemDir.id,
      path: '/system/menu',
      component: 'system/menu/index',
      icon: 'tree-table',
      permission: 'system:menu:page',
      orderNum: 3,
      isVisible: true,
      isCacheable: true,
      isDeleted: false,
      // 审计字段
      createBy: adminUser.id,
      updateBy: adminUser.id,
    },
  });

  console.log('✅ 菜单管理菜单创建成功:', menuMenu);

  // 11. 创建菜单管理相关按钮权限
  const menuPermissions = [
    { name: '菜单查询', permission: 'system:menu:list', orderNum: 1 },
    { name: '菜单新增', permission: 'system:menu:add', orderNum: 2 },
    { name: '菜单修改', permission: 'system:menu:edit', orderNum: 3 },
    { name: '菜单删除', permission: 'system:menu:remove', orderNum: 4 },
  ];

  for (const perm of menuPermissions) {
    await prisma.sysPermission.upsert({
      where: { permission: perm.permission },
      update: {},
      create: {
        name: perm.name,
        type: 2, // 按钮
        parentId: menuMenu.id,
        permission: perm.permission,
        orderNum: perm.orderNum,
        isVisible: false,
        isCacheable: false,
        isDeleted: false,
        // 审计字段
        createBy: adminUser.id,
        updateBy: adminUser.id,
      },
    });
  }

  console.log('✅ 菜单管理按钮权限创建成功');

  // 12. 获取所有权限ID，用于分配给超级管理员
  const allPermissions = await prisma.sysPermission.findMany({
    where: { isDeleted: false },
    select: { id: true },
  });

  // 13. 为超级管理员角色分配所有权限
  await prisma.sysRole.update({
    where: { id: adminRole.id },
    data: {
      permissions: {
        connect: allPermissions.map((p) => ({ id: p.id })),
      },
    },
  });

  console.log('✅ 超级管理员角色权限分配成功');

  console.log('\n🎉 种子数据初始化完成！');
  console.log('超级管理员登录信息：');
  console.log('用户名: admin');
  console.log('密码: Admin123!');
  console.log('邮箱: admin@example.com');
  console.log('手机: 13800000000');
}

main()
  .catch((e) => {
    console.error('种子数据初始化失败:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
