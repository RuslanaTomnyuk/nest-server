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

  role: string;
}

export class CreateUserParams {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  role: string;
}
