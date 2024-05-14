import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  // id: number;

  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  confirmPassword: string;

  // passwordChangeAt: Date;

  // passwordResetToken: string;

  // passwordResetTokenExpires: Date;

  role: string;
}
