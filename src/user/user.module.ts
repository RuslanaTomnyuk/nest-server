import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { RoleModule } from '../role/role.module';
import { MailModule } from '../mail/mail.module';

import { UserController } from './user.controller';

import { UserService } from './user.service';
import { RoleService } from '../role/role.service';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [JwtModule.register({}), RoleModule, MailModule],
  controllers: [UserController],
  providers: [UserService, RoleService, MailService, PrismaService],
  exports: [UserService, RoleService],
})
export class UserModule {}
