import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateJobPositionDto } from '../dto/create-job-position.dto';
import { UpdateJobPositionDto } from '../dto/update-job-position.dto';
import { JobPosition } from '../entities/job-position.entity';

@Injectable()
export class JobPositionService {
  constructor(
    @InjectRepository(JobPosition)
    private jobPositionRepository: Repository<JobPosition>,
  ) {}

  async create(createJobPositionDto: CreateJobPositionDto) {
    return await this.jobPositionRepository.create(createJobPositionDto);
  }

  async findJobList() {
    return await this.jobPositionRepository.find();
  }

  async findOneById(id: number) {
    try {
      return await this.jobPositionRepository.findOneOrFail({
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

  async updateJobPosition(
    id: number,
    updateJobPositionDto: UpdateJobPositionDto,
  ) {
    return await this.jobPositionRepository.update(id, updateJobPositionDto);
  }

  async remove(id: number) {
    return await this.jobPositionRepository.delete(id);
  }
}
