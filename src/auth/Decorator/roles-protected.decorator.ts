import { ValidRoles } from '../interfaces';
import { SetMetadata } from '@nestjs/common';

export const META_ROLES = 'roles';

export const roleProtected = (...args: ValidRoles[]) => {
  return SetMetadata(META_ROLES, args);
};
