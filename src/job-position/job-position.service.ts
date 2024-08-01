import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateJobPositionDto } from './dto/create-job-position.dto';
import { UpdateJobPositionDto } from './dto/update-job-position.dto';
import { JobPosition } from './entities/job-position.entity';

@Injectable()
export class JobPositionService {
  constructor(
    @InjectRepository(JobPosition)
    private jobPositionRepository: Repository<JobPosition>,
  ) {}

  create(createJobPositionDto: CreateJobPositionDto) {
    return this.jobPositionRepository.create(createJobPositionDto);
  }

  findJobList() {
    return this.jobPositionRepository.find();
  }

  findOneById(id: number) {
    try {
      return this.jobPositionRepository.findOneOrFail({
        where: { id },
      });
    } catch (error) {
      console.log('Get one Job Position by id error: ', error.message ?? error);
      throw new HttpException(
        `Job Position with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  updateJobPosition(id: number, updateJobPositionDto: UpdateJobPositionDto) {
    return this.jobPositionRepository.update(id, updateJobPositionDto);
  }

  remove(id: number) {
    return this.jobPositionRepository.delete(id);
  }
}
