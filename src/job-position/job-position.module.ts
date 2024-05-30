import { Module } from '@nestjs/common';
import { JobPositionService } from './services/job-position.service';
import { JobPositionController } from './controllers/job-position.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPosition } from './entities/job-position.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([JobPosition]), JwtModule],
  controllers: [JobPositionController],
  providers: [JobPositionService],
})
export class JobPositionModule {}
