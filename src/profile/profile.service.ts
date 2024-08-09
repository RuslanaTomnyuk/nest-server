import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';

import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async updateProfile(user, updateUserDetails: UpdateUserProfileDto, res) {
    if (
      !updateUserDetails.username ||
      !updateUserDetails.email ||
      !updateUserDetails.password
    ) {
      throw new BadRequestException(
        'Username, email and password are required.',
      );
    }

    const userExists = await this.userService.findUserById(user.id);

    if (!userExists) {
      throw new HttpException(
        'We could not find the user with a given email',
        HttpStatus.NOT_FOUND,
      );
    }
    const isPasswordValid = await bcrypt.compare(
      updateUserDetails.password,
      userExists.password,
    );

    if (!isPasswordValid) {
      throw new HttpException(
        'The current password you provided is not valid!',
        HttpStatus.FORBIDDEN,
      );
    }

    if (isPasswordValid && updateUserDetails.email !== userExists.email) {
      const emailExists = await this.userService.findUserByEmail(
        updateUserDetails.email,
      );

      if (emailExists) {
        throw new HttpException(
          'That email is already registered',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const { roleId } = await this.prisma.user_roles_role.findUnique({
      where: {
        userId: userExists.id,
      },
    });

    const role = await this.prisma.role.findUnique({
      where: {
        id: roleId,
      },
    });

    if (role.name === 'Admin') {
      isPasswordValid &&
        (await this.prisma.user.update({
          where: { id: user.id },
          data: {
            username: updateUserDetails.username,
            email: updateUserDetails.email,
          },
        }));

      const hasEmailChanged = updateUserDetails.email !== userExists.email;
      try {
        if (hasEmailChanged) {
          await this.mailService.changeEmailNotification(
            updateUserDetails.username,
            updateUserDetails.email,
          );
        }
      } catch (error) {
        console.log('Error while sending email', error);
      }

      res.status(200).json({
        status: 200,
        error: false,
        message: 'User updated Successfully',
      });
    } else {
      throw new HttpException(
        'Forbidden: Only Admin users can update the user!',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
