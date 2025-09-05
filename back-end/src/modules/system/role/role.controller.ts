import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto, RolePageQueryDto, RoleIdDto } from './dto/req-role.dto';
import { CreatePipe } from '@/common/pipes/create.pipe';
import { ApiQuery, ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('角色管理')
@Controller('system/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('/create')
  @ApiOperation({ summary: '创建角色' })
  async create(@Body(CreatePipe) createRoleDto: CreateRoleDto) {
    return await this.roleService.create(createRoleDto);
  }

  @Get('/page')
  @ApiOperation({ summary: '分页查询角色列表' })
  @ApiQuery({ type: RolePageQueryDto })
  async findAll(@Query() query: RolePageQueryDto) {
    return await this.roleService.findPage(query);
  }

  @Get('/detail')
  @ApiOperation({ summary: '根据ID查询角色详情' })
  findOne(@Query('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Post('/update')
  @ApiOperation({ summary: '更新角色' })
  async update(@Body() updateRoleDto: UpdateRoleDto) {
    return await this.roleService.update(updateRoleDto);
  }

  @Post('/delete')
  @ApiOperation({ summary: '删除角色' })
  @ApiBody({ type: RoleIdDto })
  remove(@Body('id') id: string) {
    return this.roleService.remove(+id);
  }

  @Get('/list')
  @ApiOperation({ summary: '获取所有角色列表（用于下拉选择）' })
  async findAllList() {
    return await this.roleService.findAll();
  }
}
