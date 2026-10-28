import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMediaDto {
  @IsNotEmpty()
  @IsString()
  type: string; // 'Photo' | 'Video'

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  shortDesc: string;

  @IsOptional()
  tags?: any; // can be string or string[]

  @IsOptional()
  @IsString()
  videoPlatform?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;
}

