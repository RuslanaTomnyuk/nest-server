import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AccessTokenStrategy } from '../strategies/accessToken.strategy';
import { RefreshTokenStrategy } from '../strategies/refreshToken.strategy';

import { AuthController } from './auth.controller';

import { UserModule } from '../user/user.module';
import { UserTokenModule } from '../user-token/user-token.module';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserTokenService } from '../user-token/user-token.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.register({}),
    UserModule,
    UserTokenModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    UserTokenService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    MailService,
    PrismaService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
