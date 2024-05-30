import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';
import * as bcrypt from 'bcrypt';
import { AuthPayloadDto } from '../dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { Response as ResponseType } from 'express';
import { UserTokenService } from 'src/user-token/user-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userTokenService: UserTokenService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: AuthPayloadDto) {
    console.log('validateUser', email, password);

    // try {
    const findUser = await this.userService.findUserByEmail(email);
    console.log('findUser', findUser);

    // const authenticated = await bcrypt.compare(password, findUser.password);
    if (!findUser) {
      throw new UnauthorizedException();
    }
    // if (!findUser) {
    //   throw new HttpException('Access Denied', HttpStatus.FORBIDDEN);
    // }

    // if (findUser && (await bcrypt.compare(password, findUser.password))) {
    //   const {
    //     password,
    //     role,
    //     roles,
    //     passwordChangeAt,
    //     passwordResetToken,
    //     passwordResetTokenExpires,
    //     ...user
    //   } = findUser;

    return findUser;
    // } catch (error) {
    //   throw new UnauthorizedException('Credentials are not valid.');
    // }
  }

  async login(authPayload: AuthPayloadDto, response: ResponseType) {
    // console.log('login - service authPayload', authPayload);

    const { email, password } = authPayload;

    if (!email || !password) {
      throw new BadRequestException('Username and password are required.');
    }

    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new HttpException('Account does not exist', HttpStatus.NOT_FOUND);
    }

    const {
      password: userPassword,
      passwordChangeAt,
      passwordResetToken,
      passwordResetTokenExpires,
      ...userData
    } = user;

    const isPasswordValid = await bcrypt.compare(password, userPassword);

    const payload = {
      id: user.id,
      email: user.email,
      sub: {
        name: user.username,
      },
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
    });

    if (isPasswordValid) {
      this.userTokenService.create({
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
      return response.status(401).json({
        error: true,
        message:
          'Invalid email or password. Please try again with the correct credentials.',
      });
    }
  }

  async refreshToken(user: User) {
    const payload = {
      email: user.email,
      id: user.id,
      sub: {
        username: user.username,
      },
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
