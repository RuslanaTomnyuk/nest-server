import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty } from 'class-validator';
export class UpdateUserDto extends PartialType(CreateUserDto) {
  username: string;

  @IsEmail()
  email: string;
}

export class UpdateUserProfileDto extends PartialType(CreateUserDto) {
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
