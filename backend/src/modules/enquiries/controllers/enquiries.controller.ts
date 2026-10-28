import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EnquiriesService } from '../services/enquiries.service';
import { CreateEnquiryDto } from '../dto/create-enquiry.dto';
import { UpdateEnquiryStatusDto } from '../dto/update-enquiry-status.dto';
import { ReplyEnquiryDto } from '../dto/reply-enquiry.dto';
import { EnquiryQueryDto } from '../dto/enquiry-query.dto';
import { Public } from '../../../common/decorators/public.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';
import { AdminJwtAuthGuard } from '../../auth/guards/admin-jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';

@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('attachment'))
  async create(
    @Body() createEnquiryDto: CreateEnquiryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.enquiriesService.create(createEnquiryDto, file);
  }

  @UseGuards(AdminJwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get()
  async findAll(@Query() query: EnquiryQueryDto) {
    return this.enquiriesService.findAll(query);
  }

  @UseGuards(AdminJwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.enquiriesService.findOne(id);
  }

  @UseGuards(AdminJwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateEnquiryStatusDto,
  ) {
    return this.enquiriesService.updateStatus(id, dto.status);
  }

  @UseGuards(AdminJwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post(':id/reply')
  async addReply(
    @Param('id') id: string,
    @Body() replyDto: ReplyEnquiryDto,
  ) {
    return this.enquiriesService.addReply(id, replyDto);
  }

  @UseGuards(AdminJwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.enquiriesService.remove(id);
  }
}

