import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';
import { AdminJwtAuthGuard } from '../../auth/guards/admin-jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';

@Controller('dashboard')
@UseGuards(AdminJwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async getStats() {
    return this.dashboardService.getStats();
  }
}

