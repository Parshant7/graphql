import { SetMetadata } from '@nestjs/common';
import { role } from '../enums/role.enum';
export const ROLES_KEY = 'role';
export const RoleType = (...roles: role[]) => SetMetadata(ROLES_KEY, roles);
