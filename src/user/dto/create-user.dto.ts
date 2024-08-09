import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  confirmPassword: string;

  @IsNotEmpty()
  role: string;
}
