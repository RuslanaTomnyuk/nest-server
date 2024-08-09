import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { user } from '@prisma/client';

import { Response as ResponseType } from 'express';

import bcrypt from 'bcrypt';
import crypto from 'crypto';

import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { UserTokenService } from '../user-token/user-token.service';
import { MailService } from '../mail/mail.service';

import { AuthPayloadDto } from './dto/auth.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly userTokenService: UserTokenService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async validateUser({ email, password }: AuthPayloadDto) {
    try {
      const findUser = await this.userService.findUserByEmail(email);

      const authenticated = await bcrypt.compare(password, findUser.password);

      if (!findUser) {
        throw new UnauthorizedException();
      }

      if (findUser && authenticated) {
        const {
          password,
          passwordChangeAt,
          passwordResetToken,
          passwordResetTokenExpires,
          ...user
        } = findUser;

        return user;
      }
    } catch (error) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
  }

  async login(authPayload: AuthPayloadDto, response: ResponseType) {
    const { email, password } = authPayload;

    if (!email || !password) {
      throw new BadRequestException('Username and password are required.');
    }

    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new HttpException('There is no such user', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);

    const {
      password: _,
      passwordChangeAt,
      passwordResetToken,
      passwordResetTokenExpires,
      ...userData
    } = user;

    if (isPasswordValid) {
      const userTokenExist = await this.userTokenService.findOneById(user.id);

      if (userTokenExist) {
        await this.userTokenService.remove(userTokenExist.userId);
      }

      await this.userTokenService.create({
        userId: user.id,
        token: refreshToken,
      });

      response
        .status(200)
        .setHeader('Authorization', `Bearer ${accessToken}`)
        .cookie('auth', refreshToken, {
          secure: true,
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000,
        })
        .json({
          status: 200,
          error: false,
          accessToken,
          message: 'Logged in successfully',
          userData,
        });
    } else {
      response.status(401).json({
        error: true,
        message:
          'Invalid email or password. Please try again with the correct credentials.',
      });
    }
  }

  async changePassword(user: user, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, password } = changePasswordDto;

    const userExists = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!userExists) {
      throw new HttpException(
        'We could not find the user with a given email',
        HttpStatus.NOT_FOUND,
      );
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      userExists.password,
    );

    if (!isCurrentPasswordValid) {
      throw new HttpException(
        'The current password you provided is not valid!',
        HttpStatus.FORBIDDEN,
      );
    }

    const hashNewPassword = await bcrypt.hash(
      password,
      +this.configService.get<string>('SALT'),
    );

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
      isCurrentPasswordValid &&
        (await this.prisma.user.update({
          where: { id: user.id },
          data: {
            password: hashNewPassword,
            email: user.email,
          },
        }));

      throw new HttpException('User updated Successfully', HttpStatus.CREATED);
    } else {
      throw new HttpException(
        'Forbidden: Only Admin users can update the user!',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async forgotPassword(email: string, res) {
    try {
      const user = await this.userService.findUserByEmail(email);

      if (!user) {
        throw new NotFoundException();
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedResetToken = await bcrypt.hash(
        resetToken,
        +this.configService.get<string>('SALT'),
      );

      user.passwordResetToken = hashedResetToken;
      user.passwordResetTokenExpires = new Date(Date.now() + 20 * 60 * 1000);

      await this.userService.updateUser(user.id, { ...user });

      try {
        await this.mailService.sendPasswordResetEmail(
          +user.id,
          email,
          resetToken,
        );

        res.status(200).json({
          status: 200,
          success: true,
          message: 'The Password reset link was sent to your email.',
        });
      } catch (error) {
        user.passwordResetToken = null;
        user.passwordResetTokenExpires = null;
        await this.userService.updateUser(user.id, { ...user });
        console.log('Failed sending email', error);
      }
    } catch (error) {
      console.error(
        'There was an error sending password reset email. Please, try again later!',
        error,
      );
    }
  }

  async resetPassword(id: string, token: string, newPassword: string, res) {
    const user = await this.userService.findUserById(+id);

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    if (user.passwordResetToken === null) {
      throw new HttpException(
        'Token is invalid or has expired!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isTokenValid = await bcrypt.compare(token, user.passwordResetToken);

    if (!isTokenValid) {
      throw new HttpException(
        'Token is invalid or has expired!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentTime = this.convertToMilliseconds(new Date());

    const isPasswordResetTokenExpired =
      this.convertToMilliseconds(user.passwordResetTokenExpires) < currentTime;

    if (isPasswordResetTokenExpired) {
      throw new HttpException(
        'Token is invalid or has expired!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      +this.configService.get<string>('SALT'),
    );

    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetTokenExpires = null;
    user.passwordChangeAt = new Date(Date.now());

    await this.userService.updateUser(+id, user);

    res.status(200).json({
      status: 200,
      success: true,
      message: 'The password has been reset successfully',
    });
  }

  convertToMilliseconds(utcTimestamp: Date) {
    const convertedAndFormattedDate = this.convertAndFormatDate(utcTimestamp);
    const userLocalTime = new Date(convertedAndFormattedDate);
    return userLocalTime.getTime();
  }

  convertAndFormatDate(utcTimestamp: Date) {
    const utcDate = new Date(utcTimestamp);
    const userTimezoneOffset = new Date().getTimezoneOffset();
    const userLocalTime = new Date(
      utcDate.getTime() - userTimezoneOffset * 60000,
    );

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
    }).format(userLocalTime);
  }

  async refreshToken(user, res) {
    const validRefreshToken = this.decodedRefreshToken(user.refreshToken);

    const payload = {
      id: user.id,
      email: user.email,
      sub: {
        name: user.username,
      },
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: '20m',
    });

    validRefreshToken &&
      res.status(200).setHeader('Authorization', `Bearer ${accessToken}`).json({
        error: false,
        accessToken,
        message: 'New access token created successfully',
      });
  }

  decodedRefreshToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async createAccessToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      sub: {
        name: user.username,
      },
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: '4h',
    });
  }

  async createRefreshToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      sub: {
        name: user.username,
      },
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: '1d',
    });
  }

  async logout(refreshToken: string, res) {
    try {
      const userToken = await this.userTokenService.findOneBy(refreshToken);

      if (!userToken) {
        throw new NotFoundException('There is no such token!');
      }

      await this.userTokenService.remove(userToken.userId);

      res
        .status(200)
        .clearCookie('auth')
        .json({ error: false, message: 'Logged Out Successfully' });
    } catch (err) {
      console.log('Log Out User Error!', err);
      res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
  }
}
