import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { ProfileController } from './profile.controller';

import { UserModule } from '../user/user.module';

import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import { ProfileService } from './profile.service';

import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    UserModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService, MailService, UserService],
})
export class ProfileModule {}
