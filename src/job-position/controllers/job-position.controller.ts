import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JobPositionService } from '../services/job-position.service';
import { CreateJobPositionDto } from '../dto/create-job-position.dto';
import { UpdateJobPositionDto } from '../dto/update-job-position.dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';

@UseGuards(AccessTokenGuard)
@Controller('job-list')
export class JobPositionController {
  constructor(private readonly jobPositionService: JobPositionService) {}

  @Post()
  create(@Body() createJobPositionDto: CreateJobPositionDto) {
    return this.jobPositionService.create(createJobPositionDto);
  }

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
