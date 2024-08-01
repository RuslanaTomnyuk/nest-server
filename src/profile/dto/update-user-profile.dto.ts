import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { CreateUserDto } from '../../user/dto/create-user.dto';

export class UpdateUserProfileDto extends PartialType(CreateUserDto) {
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
