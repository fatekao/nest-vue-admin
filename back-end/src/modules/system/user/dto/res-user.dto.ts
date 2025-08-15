import { ApiProperty, OmitType, IntersectionType } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';
import { CreateUserDto } from './req-user.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { AuditDto } from '@/common/dto/audit.dto';

// 用户信息响应
export class UserInfoDto extends IntersectionType(OmitType(CreateUserDto, ['password'] as const), AuditDto) {
  @ApiProperty({ description: '用户ID', example: 1 })
  @IsNumber()
  userId: number;
}

// 用户列表分页响应
export class UserListDto {
  @ApiProperty({ description: '用户列表', type: [UserInfoDto] })
  @IsArray()
  users: UserInfoDto[];

  @ApiProperty({ description: '分页信息' })
  pagination: PaginationDto;
}

// 用户列表查询参数
export class UserPageResponseDto {
  @ApiProperty({ description: '用户列表', type: [UserInfoDto] })
  @IsArray()
  list: UserInfoDto[];

  @ApiProperty({ description: '分页信息' })
  pagination: PaginationDto;
}
