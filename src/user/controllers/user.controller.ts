import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/guards/access-token.guard';

import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../dto/update-user.dto';

@UseGuards(AccessTokenGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return await this.userService.findAllUsers();
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  getUser(@Req() req: Request) {
    return req?.user;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findUserById(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.removeUser(id);
  }
}
