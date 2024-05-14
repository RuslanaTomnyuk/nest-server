import { Injectable } from '@nestjs/common';
import { CreateJobPositionDto } from './dto/create-job-position.dto';
import { UpdateJobPositionDto } from './dto/update-job-position.dto';

@Injectable()
export class JobPositionService {
  create(createJobPositionDto: CreateJobPositionDto) {
    return 'This action adds a new jobPosition';
  }

  findAll() {
    return `This action returns all jobPosition`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jobPosition`;
  }

  update(id: number, updateJobPositionDto: UpdateJobPositionDto) {
    return `This action updates a #${id} jobPosition`;
  }

  remove(id: number) {
    return `This action removes a #${id} jobPosition`;
  }
}
