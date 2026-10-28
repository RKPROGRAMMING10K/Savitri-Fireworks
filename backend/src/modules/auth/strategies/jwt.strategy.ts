import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../entities/admin.entity';
import { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { Role } from '../../../common/enums/role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'savitri_super_secure_jwt_secret_phrase_2026'),
    });
  }

  async validate(payload: JwtPayload): Promise<Admin> {
    const admin = await this.adminRepository.findOne({
      where: { id: payload.sub },
    });

    if (!admin) {
      throw new UnauthorizedException('Administrator account not found or token has expired.');
    }

    if (!admin.isActive) {
      throw new ForbiddenException('Administrator account has been deactivated.');
    }

    if (admin.role !== Role.ADMIN) {
      throw new ForbiddenException('Insufficient permissions: Only administrators are authorized.');
    }

    return admin;
  }
}

