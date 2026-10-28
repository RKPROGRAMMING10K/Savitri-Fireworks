import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString({ message: 'Current password must be a string.' })
  @IsNotEmpty({ message: 'Current password cannot be empty.' })
  currentPassword: string;

  @IsString({ message: 'New password must be a string.' })
  @IsNotEmpty({ message: 'New password cannot be empty.' })
  @MinLength(6, { message: 'New password must be at least 6 characters long.' })
  newPassword: string;
}

