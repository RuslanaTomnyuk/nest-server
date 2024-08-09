import { Module } from '@nestjs/common';
import { UserTokenController } from './user-token.controller';
import { UserTokenService } from './user-token.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [UserTokenController],
  providers: [UserTokenService, PrismaService],
  exports: [UserTokenService],
})
export class UserTokenModule {}
