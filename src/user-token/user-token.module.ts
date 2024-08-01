import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserTokenService } from './user-token.service';
import { UserTokenController } from './user-token.controller';
import { UserToken } from './entities/user-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserToken])],
  controllers: [UserTokenController],
  providers: [UserTokenService],
  exports: [UserTokenService],
})
export class UserTokenModule {}
