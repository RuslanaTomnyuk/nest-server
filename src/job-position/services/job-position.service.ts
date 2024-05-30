import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateJobPositionDto } from '../dto/create-job-position.dto';
import { UpdateJobPositionDto } from '../dto/update-job-position.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JobPosition } from '../entities/job-position.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JobPositionService {
  constructor(
    @InjectRepository(JobPosition)
    private jobPositionRepository: Repository<JobPosition>,
  ) {}

  create(createJobPositionDto: CreateJobPositionDto) {
    return 'This action adds a new jobPosition';
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

  updateJobPosition(id: number, updateJobPositionDto: UpdateJobPositionDto) {
    return `This action updates a #${id} jobPosition`;
  }

  remove(id: number) {
    return `This action removes a #${id} jobPosition`;
  }
}
