import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { RoleModule } from '../role/role.module';
import { MailModule } from '../mail/mail.module';

import { UserController } from './user.controller';

import { UserService } from './user.service';
import { RoleService } from '../role/role.service';
import { MailService } from '../mail/mail.service';

import { User } from './entities/user.entity';
import { Role } from 'src/role/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.register({}),
    RoleModule,
    MailModule,
  ],
  controllers: [UserController],
  providers: [UserService, RoleService, MailService],
  exports: [UserService, TypeOrmModule, RoleService],
})
export class UserModule {}
