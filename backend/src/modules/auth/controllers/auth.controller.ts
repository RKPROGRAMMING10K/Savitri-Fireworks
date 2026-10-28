import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { Public } from '../../../common/decorators/public.decorator';
import { CurrentAdmin } from '../../../common/decorators/current-admin.decorator';
import { AdminJwtAuthGuard } from '../guards/admin-jwt-auth.guard';
import { Admin } from '../entities/admin.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Admin Login Endpoint
   * Public route: validates credentials and returns a signed JWT access token.
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<{ message: string; data: AuthResponseDto }> {
    const data = await this.authService.login(loginDto);
    return {
      message: 'Authentication successful. Welcome to Savitri Fireworks Admin Portal.',
      data,
    };
  }

  /**
   * Admin Profile Endpoint
   * Protected: requires valid JWT bearer token and verified ADMIN role.
   */
  @UseGuards(AdminJwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentAdmin() admin: Admin): Promise<{ message: string; data: Admin }> {
    const profile = await this.authService.getProfile(admin.id);
    return {
      message: 'Admin profile retrieved successfully.',
      data: profile,
    };
  }

  /**
   * Change Admin Password
   * Protected: validates current password before updating to new hashed password.
   */
  @UseGuards(AdminJwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentAdmin('id') adminId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.changePassword(adminId, changePasswordDto);
  }

  /**
   * Admin Logout Endpoint
   */
  @UseGuards(AdminJwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(): Promise<{ message: string }> {
    return {
      message: 'Administrator session closed successfully.',
    };
  }
}

