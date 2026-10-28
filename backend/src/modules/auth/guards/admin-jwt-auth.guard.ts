import { Injectable, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../../../common/enums/role.enum';

@Injectable()
export class AdminJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication required to access the admin portal.');
    }

    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException('Forbidden: Only administrators can access this area.');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Account deactivated: This administrative account is inactive.');
    }

    return user;
  }
}

