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
  HttpStatus,
  HttpException,
  ParseIntPipe,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { RoleService } from '../../role/role.service';
import { AuthGuard } from '@nestjs/passport';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { TokenPayload } from 'src/interfaces/token-payload.interface';
import { Request, Response } from 'express';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    // private readonly roleService: RoleService,
  ) {}

  // @Post('register')
  // async createUser(@Body() createUserDto: CreateUserDto) {
  //   // const { username, email, password, confirmPassword, role } = createUserDto;

  //   // if (!username || !email || !password || !confirmPassword) {
  //   //   throw new BadRequestException('Missing required fields');
  //   // }

  //   // const userExists = await this.userService.findUserByEmail(email);

  //   // if (userExists) {
  //   //   throw new BadRequestException('Email already in use');
  //   // }

  //   // if (role !== 'Admin') {
  //   //   throw new ForbiddenException('Only Admin users can create new users');
  //   // }

  //   // if (password !== confirmPassword) {
  //   //   throw new BadRequestException(
  //   //     'Password and ConfirmPassword do not match',
  //   //   );
  //   // }
  //   // console.log(+process.env.SALT);

  //   // const hashedPassword = await bcrypt.hash(password, +process.env.SALT);
  //   // const hashedConfirmPassword = await bcrypt.hash(
  //   //   confirmPassword,
  //   //   +process.env.SALT,
  //   // );

  //   // const createdUser = await this.userService.createUser({
  //   //   username,
  //   //   email,
  //   //   password: hashedPassword,
  //   //   // confirmPassword: hashedConfirmPassword,
  //   //   role,
  //   // });

  //   // const {
  //   //   password: _,
  //   //   passwordChangeAt,
  //   //   passwordResetToken,
  //   //   passwordResetTokenExpires,
  //   //   ...userData
  //   // } = createdUser;

  //   // return { message: 'User created successfully', user: userData };
  //   return this.userService.createUser(createUserDto);
  // }

  // @UseGuards(AuthGuard())
  @Get('all')
  async findAll() {
    return await this.userService.findAllUsers();
  }

  // @UseGuards(AccessTokenGuard)
  // @Get()
  // getUser(
  //   // @CurrentUser() user: TokenPayload,
  //   @Req() req: Request,
  //   @Res() res: Response,
  // ) {
  //   console.log('auth.controller - req.user', req.user);
  //   console.log('auth.controller - res', res);
  //   // console.log('auth.controller - user', user);

  //   return req?.user;
  // }

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
