import { ArgumentMetadata, Inject, Injectable, PipeTransform } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuditDto } from '../dto/audit.dto';
import { SysUser } from '@prisma/client';
import dayjs from 'dayjs';

@Injectable()
export class CreatePipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: AuthenticatedRequest) {}

  transform(value: AuditDto, metadata: ArgumentMetadata) {
    const user: SysUser = this.request.user;
    value.updateBy = user.id;
    value.updateTime = dayjs().format();
    return value;
  }
}
