import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Admin } from '../entities/admin.entity';
import { LoginDto } from '../dto/login.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { Role } from '../../../common/enums/role.enum';
import { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validates admin credentials against the database.
   */
  async validateAdmin(email: string, pass: string): Promise<Admin | null> {
    const normalizedEmail = email.toLowerCase().trim();

    const admin = await this.adminRepository
      .createQueryBuilder('admin')
      .addSelect('admin.password')
      .where('admin.email = :email', { email: normalizedEmail })
      .getOne();

    if (!admin) {
      return null;
    }

    if (!admin.isActive) {
      throw new UnauthorizedException('Administrative account has been disabled.');
    }

    if (admin.role !== Role.ADMIN) {
      throw new UnauthorizedException('Access restricted: User is not an administrator.');
    }

    const isPasswordValid = await bcrypt.compare(pass, admin.password);
    if (!isPasswordValid) {
      return null;
    }

    // Exclude password from the returned admin object
    const { password, ...result } = admin;
    return result as Admin;
  }

  /**
   * Authenticates admin and generates access token.
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const admin = await this.validateAdmin(loginDto.email, loginDto.password);

    if (!admin) {
      throw new UnauthorizedException('Invalid administrative email or password.');
    }

    // Update last login timestamp
    admin.lastLoginAt = new Date();
    await this.adminRepository.update(admin.id, { lastLoginAt: admin.lastLoginAt });

    const payload: JwtPayload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: '7d',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        lastLoginAt: admin.lastLoginAt,
        createdAt: admin.createdAt,
      },
    };
  }

  /**
   * Retrieves profile details for the authenticated admin.
   */
  async getProfile(adminId: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
    });

    if (!admin) {
      throw new UnauthorizedException('Administrator profile not found.');
    }

    return admin;
  }

  /**
   * Changes the authenticated admin's password after validating current password.
   */
  async changePassword(adminId: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const admin = await this.adminRepository
      .createQueryBuilder('admin')
      .addSelect('admin.password')
      .where('admin.id = :id', { id: adminId })
      .getOne();

    if (!admin) {
      throw new UnauthorizedException('Administrator account not found.');
    }

    const isMatch = await bcrypt.compare(changePasswordDto.currentPassword, admin.password);
    if (!isMatch) {
      throw new BadRequestException('Current password does not match.');
    }

    if (changePasswordDto.currentPassword === changePasswordDto.newPassword) {
      throw new BadRequestException('New password must be different from the current password.');
    }

    admin.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.adminRepository.save(admin);

    return { message: 'Password updated successfully.' };
  }
}
