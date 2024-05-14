import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JobPositionService } from './job-position.service';
import { CreateJobPositionDto } from './dto/create-job-position.dto';
import { UpdateJobPositionDto } from './dto/update-job-position.dto';

@Controller('job-position')
export class JobPositionController {
  constructor(private readonly jobPositionService: JobPositionService) {}

  @Post()
  create(@Body() createJobPositionDto: CreateJobPositionDto) {
    return this.jobPositionService.create(createJobPositionDto);
  }

  @Get()
  findAll() {
    return this.jobPositionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobPositionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobPositionDto: UpdateJobPositionDto) {
    return this.jobPositionService.update(+id, updateJobPositionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobPositionService.remove(+id);
  }
}
