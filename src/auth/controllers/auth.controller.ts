import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthPayloadDto } from '../dto/auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/services/user.service';
import { Response as ResponseType } from 'express';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { RoleService } from 'src/role/role.service';
import { UpdateUserProfileDto } from 'src/user/dto/update-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roleService: RoleService,
  ) {}

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    const userRole = await this.roleService.findUserRole(createUserDto.role);
    return await this.userService.createUser(createUserDto, userRole);
  }

  @Post('login')
  // @UseGuards(AccessTokenGuard)
  login(
    @Body() authPayload: AuthPayloadDto,
    // @Req() req: Request,
    // @CurrentUser() user: User,
    @Res({ passthrough: true }) response: ResponseType,
  ) {
    return this.authService.login(authPayload, response);
  }

  // @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Req() req) {
    // const { username, email } = req.user;
    return this.authService.refreshToken(req.user);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('profile')
  async updateUserProfile(
    @Req() req: any,
    @Body() updateUserDto: UpdateUserProfileDto,
  ) {
    return await this.userService.updateUserProfile(req.user, updateUserDto);
  }
}
