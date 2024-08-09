import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JobPositionController } from './job-position.controller';
import { JobPositionService } from './job-position.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [JwtModule],
  controllers: [JobPositionController],
  providers: [JobPositionService, PrismaService],
})
export class JobPositionModule {}
