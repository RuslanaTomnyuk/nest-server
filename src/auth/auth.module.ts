import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/services/user.service';
import { PassportModule } from '@nestjs/passport';
// import { LocalStrategy } from './strategies/local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
// import { AccessTokenStrategy } from './strategies/accessToken.strategy';
// import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { UserModule } from 'src/user/user.module';
import { UserTokenService } from 'src/user-token/user-token.service';
import { UserTokenModule } from 'src/user-token/user-token.module';
import { UserToken } from 'src/user-token/entities/user-token.entity';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
// import { AccessTokenGuard } from 'src/guards/access-token.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserToken]),
    JwtModule.register({
      // global: true,
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
    UserTokenModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // LocalStrategy,
    UserService,
    UserTokenService,
    AccessTokenStrategy,
    // RefreshTokenStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
