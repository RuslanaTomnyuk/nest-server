import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { AccessTokenGuard } from '../guards/access-token.guard';

import { JobPositionService } from './job-position.service';
import { UpdateJobPositionDto } from './dto/update-job-position.dto';

@UseGuards(AccessTokenGuard)
@Controller('job-list')
export class JobPositionController {
  constructor(private readonly jobPositionService: JobPositionService) {}

  @Post()
  create(@Body() createJobPositionDto: Prisma.job_positionCreateInput) {
    return this.jobPositionService.create(createJobPositionDto);
  }

  @Get()
  async findJobList() {
    return await this.jobPositionService.findJobList();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobPositionService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateJobPositionDto: UpdateJobPositionDto,
  ) {
    return this.jobPositionService.updateJobPosition(id, updateJobPositionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.jobPositionService.remove(id);
  }
}
