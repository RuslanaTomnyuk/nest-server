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

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

import { AuthPayloadDto } from './dto/auth.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';

import { AccessTokenGuard } from '../guards/access-token.guard';
import { RefreshJwtGuard } from '../guards/jwt-refresh.guard';

import { Public } from '../decorators/public.decorator';
import { GetCurrentUserToken } from '../decorators/current-user-token.decorator';

import { RoleService } from '../role/role.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  @Public()
  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
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
  @Patch('change-password')
  async changePassword(
    @Req() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.authService.changePassword(req?.user, changePasswordDto);
  }

  @Post('forgot-password')
  forgotPassword(
    @Res() res: ResponseType,
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ) {
    return this.authService.forgotPassword(forgotPasswordDto.email, res);
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
