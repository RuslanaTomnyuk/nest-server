import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class RegisterPayloadDto {
  username: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  confirmPassword: string;

  role: string;
}
