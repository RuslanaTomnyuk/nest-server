import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const { username, email, password, confirmPassword, role } = createUserDto;

    if (!username || !email || !password || !confirmPassword) {
      throw new BadRequestException('Missing required fields');
    }

    const userExists = this.userService.findOneBy(email);

    if (userExists) {
      throw new BadRequestException('Email already in use');
    }

    if (role !== 'Admin') {
      throw new ForbiddenException('Only Admin users can create new users');
    }

    if (password !== confirmPassword) {
      throw new BadRequestException(
        'Password and ConfirmPassword do not match',
      );
    }

    const hashedPassword = await bcrypt.hash(password, +process.env.SALT);
    const hashedConfirmPassword = await bcrypt.hash(
      confirmPassword,
      +process.env.SALT,
    );

    const createdUser = await this.userService.createUser({
      username,
      email,
      password: hashedPassword,
      confirmPassword: hashedConfirmPassword,
      role,
    });

    return { message: 'User created successfully', user: createdUser };
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
