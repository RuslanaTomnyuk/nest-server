import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserService } from 'src/user/services/user.service';
import { MailService } from './services/nodemailer.service';

import { User } from 'src/user/entities/user.entity';
import { UserToken } from 'src/user-token/entities/user-token.entity';

import { UserModule } from 'src/user/user.module';
import { UserTokenModule } from 'src/user-token/user-token.module';

import { UserTokenService } from 'src/user-token/user-token.service';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserToken]),
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
  ],
  exports: [AuthService, MailService],
})
export class AuthModule {}
