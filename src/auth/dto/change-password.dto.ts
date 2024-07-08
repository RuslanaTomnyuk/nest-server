import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { IsNotEmpty } from 'class-validator';

export class ChangePasswordDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  currentPassword: string;

  @IsNotEmpty()
  password: string;
}
