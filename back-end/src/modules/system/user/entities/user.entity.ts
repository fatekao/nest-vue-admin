export interface UserEntity {
  id: number;
  username: string;
  [key: string]: any; // 允许其他动态属性，因为Prisma可能会返回额外字段
}
