export class Menu {
  menuId: number;
  menuName: string;
  parentId: number;
  parentMenu?: Menu;
  chidrenMenus?: Menu[];
  path?: string;
  component?: string;
  icon?: string;
  orderNum?: number;
  isVisible?: boolean;
  isCacheable?: boolean;
  isDeleted?: boolean;
  createTime?: Date;
  updateTime?: Date;
  createBy?: number;
  updateBy?: number;

  // 关联角色（在实际使用中可能需要根据需要添加）
  roles?: any[]; // 这里使用any[]是因为SysRole实体可能还未完全定义
}
