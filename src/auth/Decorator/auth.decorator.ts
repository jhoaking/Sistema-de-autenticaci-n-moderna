import { ValidRoles } from '../interfaces';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { roleProtected } from './roles-protected.decorator';
import { UserRoleGuard } from '../guard/user-role/user-role.guard';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    roleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
