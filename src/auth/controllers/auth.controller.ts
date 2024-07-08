import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response as ResponseType, Request } from 'express';

import { AuthService } from '../services/auth.service';
import { UserService } from 'src/user/services/user.service';

import { AuthPayloadDto } from '../dto/auth.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserProfileDto } from 'src/user/dto/update-user.dto';

import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { RefreshJwtGuard } from 'src/guards/jwt-refresh.guard';

import { Public } from 'src/decorators/public.decorator';
import { GetCurrentUserToken } from 'src/decorators/current-user-token.decorator';

import { RoleService } from 'src/role/role.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roleService: RoleService,
  ) {}

  @Public()
  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    const userRole = await this.roleService.findUserRole(createUserDto.role);
    return await this.userService.createUser(createUserDto, userRole);
  }

  @Public()
  @Post('login')
  async login(
    @Body() authPayload: AuthPayloadDto,
    @Res({ passthrough: true }) response: ResponseType,
  ) {
    return await this.authService.login(authPayload, response);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: ResponseType) {
    return this.authService.refreshToken(req?.user, res);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('profile')
  async updateUserProfile(
    @Req() req: any,
    @Res() res: ResponseType,
    @Body() updateUserDto: UpdateUserProfileDto,
  ) {
    return await this.userService.updateUserProfile(
      req?.user,
      updateUserDto,
      res,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Patch('change-password')
  async changePassword(
    @Req() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.userService.changePassword(req?.user, changePasswordDto);
  }

  @Post('forgot-password')
  async forgotPassword(
    @Res() res: ResponseType,
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ) {
    return await this.authService.forgotPassword(forgotPasswordDto.email, res);
  }

  @Patch('reset-password/:id/:token')
  async resetPassword(
    @Res() res: ResponseType,
    @Param('id') id: string,
    @Param('token') token: string,
    @Body('password') password: string,
  ): Promise<any> {
    try {
      if (!password || !token) {
        throw new HttpException(
          'Missing required fields.',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.authService.resetPassword(id, token, password, res);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  async logout(
    @GetCurrentUserToken() refreshToken: string,
    @Res({ passthrough: true }) res: ResponseType,
  ) {
    return await this.authService.logout(refreshToken, res);
  }
}
