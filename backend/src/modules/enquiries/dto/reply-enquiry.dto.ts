import { IsNotEmpty, IsString } from 'class-validator';

export class ReplyEnquiryDto {
  @IsNotEmpty()
  @IsString()
  message: string;
}

