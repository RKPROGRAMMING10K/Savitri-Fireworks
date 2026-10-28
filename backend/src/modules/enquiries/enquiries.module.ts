import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enquiry } from './entities/enquiry.entity';
import { EnquiriesService } from './services/enquiries.service';
import { EnquiriesController } from './controllers/enquiries.controller';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([Enquiry]), StorageModule],
  controllers: [EnquiriesController],
  providers: [EnquiriesService],
  exports: [EnquiriesService, TypeOrmModule],
})
export class EnquiriesModule {}

