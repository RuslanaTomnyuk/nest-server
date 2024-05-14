import { Module } from '@nestjs/common';
import { UserTokenService } from './user-token.service';
import { UserTokenController } from './user-token.controller';
import { UserToken } from './entities/user-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserToken])],
  controllers: [UserTokenController],
  providers: [UserTokenService],
})
export class UserTokenModule {}
