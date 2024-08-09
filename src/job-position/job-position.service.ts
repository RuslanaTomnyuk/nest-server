import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateJobPositionDto } from './dto/update-job-position.dto';

@Injectable()
export class JobPositionService {
  constructor(private readonly prisma: PrismaService) {}

  create(createJobPositionDto: Prisma.job_positionCreateInput) {
    return this.prisma.job_position.create({
      data: createJobPositionDto,
    });
  }

  findJobList() {
    return this.prisma.job_position.findMany();
  }

  findOneById(id: number) {
    try {
      return this.prisma.job_position.findUnique({
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
    return this.prisma.job_position.update({
      where: { id },
      data: updateJobPositionDto,
    });
  }

  remove(id: number) {
    return this.prisma.job_position.delete({
      where: { id },
    });
  }
}
