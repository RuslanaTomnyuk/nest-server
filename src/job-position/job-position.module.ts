import { Module } from '@nestjs/common';
import { JobPositionService } from './job-position.service';
import { JobPositionController } from './job-position.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPosition } from './entities/job-position.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobPosition])],
  controllers: [JobPositionController],
  providers: [JobPositionService],
})
export class JobPositionModule {}
