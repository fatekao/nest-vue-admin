import { Inject, Injectable, PipeTransform, ArgumentMetadata, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AuditDto } from '../dto/audit.dto';

@Injectable({ scope: Scope.REQUEST })
export class CreatePipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: AuthenticatedRequest) {}

  transform(value: AuditDto, _metadata: ArgumentMetadata) {
    const user = this.request.user;
    if (user) {
      value.createBy = user.userId;
      value.updateBy = user.userId;
    }
    return value;
  }
}
