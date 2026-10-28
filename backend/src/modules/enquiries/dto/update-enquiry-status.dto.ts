import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class UpdateEnquiryStatusDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['Pending', 'Contacted', 'Resolved'])
  status: string;
}

