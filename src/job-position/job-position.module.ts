import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobPositionController } from './controllers/job-position.controller';
import { JobPositionService } from './services/job-position.service';
import { JobPosition } from './entities/job-position.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobPosition]), JwtModule],
  controllers: [JobPositionController],
  providers: [JobPositionService],
})
export class JobPositionModule {}
