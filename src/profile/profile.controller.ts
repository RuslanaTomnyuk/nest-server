import { Body, Controller, Patch, Req, Res, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { ProfileService } from './profile.service';

@Controller()
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @UseGuards(AccessTokenGuard)
  @Patch('auth/profile')
  async updateUserProfile(
    @Req() req: any,
    @Res() res: ResponseType,
    @Body() updateUserDto: UpdateUserProfileDto,
  ) {
    return await this.profileService.updateProfile(
      req?.user,
      updateUserDto,
      res,
    );
  }
}
