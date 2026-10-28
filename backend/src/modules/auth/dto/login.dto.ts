import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid administrative email address.' })
  @IsNotEmpty({ message: 'Email address cannot be empty.' })
  email: string;

  @IsString({ message: 'Password must be a valid string.' })
  @IsNotEmpty({ message: 'Password cannot be empty.' })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  password: string;
}

