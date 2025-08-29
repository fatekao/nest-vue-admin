import { ArgumentMetadata, Inject, Injectable, PipeTransform } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuditDto } from '../dto/audit.dto';
import { SysUser } from '@prisma/client';
import dayjs from 'dayjs';

@Injectable()
export class CreatePipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: AuthenticatedRequest) {}

  transform(value: AuditDto, metadata: ArgumentMetadata) {
    console.log('########createPipe############', this.request.user);
    const user: SysUser = this.request.user;
    value.createBy = user.id;
    value.createTime = dayjs().format();
    console.log('########createPipe############', value);
    return value;
  }
}
