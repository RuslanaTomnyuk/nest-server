import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class ForgotPasswordDto extends PartialType(CreateUserDto) {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
