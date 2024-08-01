import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConnectOptions } from 'typeorm';

import { UserTokenModule } from './user-token/user-token.module';
import { JobPositionModule } from './job-position/job-position.module';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailService } from './mail/mail.service';

import databaseConfig from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return configService.get<ConnectOptions>('database');
      },
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('NODEMAIL_HOST'),
          port: configService.get<number>('NODEMAIL_PORT'),
          auth: {
            user: configService.get<string>('NODEMAIL_USER'),
            pass: configService.get<string>('NODEMAIL_PASS'),
          },
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    UserTokenModule,
    JobPositionModule,
    RoleModule,
    AuthModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService, TypeOrmModule],
})
export class AppModule {}
