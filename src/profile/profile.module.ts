import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ProfileController } from './profile.controller';

import { UserModule } from '../user/user.module';

import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import { ProfileService } from './profile.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [JwtModule.register({}), UserModule],
  controllers: [ProfileController],
  providers: [ProfileService, MailService, UserService, PrismaService],
})
export class ProfileModule {}
