import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class EnquiryQueryDto {
  @IsOptional()
  @IsString()
  status?: string; // 'Pending' | 'Contacted' | 'Resolved' | 'All'

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  enquiryType?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 50;
}

