import { ApiProperty } from '@nestjs/swagger';

export class PermissionListResDto {
  @ApiProperty({ description: '菜单ID' })
  id: number;

  @ApiProperty({ description: '菜单名称' })
  name: string;

  @ApiProperty({ description: '菜单图标' })
  parentId: number | null;

  @ApiProperty({ description: '菜单路径' })
  path: string;

  @ApiProperty({ description: '菜单组件' })
  component: string | null;

  @ApiProperty({ description: '菜单图标' })
  icon: string | null;

  @ApiProperty({ description: '菜单排序' })
  orderNum: number | null;

  @ApiProperty({ description: '菜单状态' })
  isVisible: boolean;

  @ApiProperty({ description: '菜单缓存' })
  isCacheable: boolean;
}

export class PermissionTreeResDto extends PermissionListResDto {
  @ApiProperty({ description: '子级菜单', type: [PermissionTreeResDto] })
  children?: PermissionTreeResDto[];
}
