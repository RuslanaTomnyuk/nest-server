import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { JobPositionService } from '../services/job-position.service';
import { CreateJobPositionDto } from '../dto/create-job-position.dto';
import { UpdateJobPositionDto } from '../dto/update-job-position.dto';

@Controller('job-list')
export class JobPositionController {
  constructor(private readonly jobPositionService: JobPositionService) {}

  @Post()
  create(@Body() createJobPositionDto: CreateJobPositionDto) {
    return this.jobPositionService.create(createJobPositionDto);
  }

  // @UseGuards(AccessTokenGuard)
  @Get()
  async findJobList() {
    return await this.jobPositionService.findJobList();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.jobPositionService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateJobPositionDto: UpdateJobPositionDto,
  ) {
    return this.jobPositionService.updateJobPosition(+id, updateJobPositionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.jobPositionService.remove(+id);
  }
}
