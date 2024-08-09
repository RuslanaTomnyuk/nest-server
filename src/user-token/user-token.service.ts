import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CreateUserTokenDto } from './dto/create-user-token.dto';

@Injectable()
export class UserTokenService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserTokenDto: CreateUserTokenDto) {
    return this.prisma.user_token.create({
      data: createUserTokenDto,
    });
  }

  findAll() {
    return this.prisma.user_token.findMany();
  }

  findOneById(id: number) {
    return this.prisma.user_token.findUnique({
      where: { userId: id },
    });
  }

  findOneBy(token: string) {
    return this.prisma.user_token.findFirst({
      where: { token },
    });
  }

  update(id: number, updateUserTokenDto: Prisma.user_tokenUpdateInput) {
    return this.prisma.user_token.update({
      where: {
        userId: +id,
      },
      data: updateUserTokenDto,
    });
  }

  remove(id: number) {
    return this.prisma.user_token.delete({
      where: { userId: +id },
    });
  }
}
