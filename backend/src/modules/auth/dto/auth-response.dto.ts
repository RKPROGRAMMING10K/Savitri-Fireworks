import { Role } from '../../../common/enums/role.enum';

export class AdminProfileDto {
  id: string;
  email: string;
  name: string;
  role: Role;
  lastLoginAt: Date | null;
  createdAt: Date;
}

export class AuthResponseDto {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  admin: AdminProfileDto;
}

