import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth/auth.service';
import { UserTokenService } from '../user-token/user-token.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly authService: AuthService,
    private readonly userTokenService: UserTokenService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJWT,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  private static extractJWT(req: Request): string | null {
    if (req.cookies && 'auth' in req.cookies && req.cookies.auth.length > 0) {
      return req.cookies.auth;
    }
    return null;
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.cookies.auth;
    const refreshTokenExists =
      await this.userTokenService.findOneBy(refreshToken);

    if (!refreshTokenExists) {
      throw new HttpException(
        'There is no such token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return { ...payload, refreshToken };
  }

  async validate1(payload: any) {
    return { userId: payload.id };
  }
}
