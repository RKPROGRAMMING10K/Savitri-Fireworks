import {
  Controller,
  Get,
  Post,
  Put,
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
import { MediaService } from '../services/media.service';
import { CreateMediaDto } from '../dto/create-media.dto';
import { UpdateMediaDto } from '../dto/update-media.dto';
import { MediaQueryDto } from '../dto/media-query.dto';
import { Public } from '../../../common/decorators/public.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';
import { AdminJwtAuthGuard } from '../../auth/guards/admin-jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Public()
  @Get()
  async findAll(@Query() query: MediaQueryDto) {
    return this.mediaService.findAll(query);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.mediaService.findOne(id);
  }

  @UseGuards(AdminJwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createMediaDto: CreateMediaDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.mediaService.create(createMediaDto, file);
  }

  @UseGuards(AdminJwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateMediaDto: UpdateMediaDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.mediaService.update(id, updateMediaDto, file);
  }

  @UseGuards(AdminJwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.mediaService.remove(id);
  }
}

