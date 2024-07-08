import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserTokenDto } from './dto/create-user-token.dto';
import { UpdateUserTokenDto } from './dto/update-user-token.dto';
import { UserToken } from './entities/user-token.entity';

@Injectable()
export class UserTokenService {
  constructor(
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
  ) {}

  create(createUserTokenDto: CreateUserTokenDto) {
    return this.userTokenRepository.save(createUserTokenDto);
  }

  findAll() {
    return this.userTokenRepository.find();
  }

  findOneById(id: number) {
    return this.userTokenRepository.findOneBy({ userId: id });
  }

  findOneBy(token: string) {
    return this.userTokenRepository.findOneBy({ token });
  }

  update(id: number, updateUserTokenDto: UpdateUserTokenDto) {
    return this.userTokenRepository.update(id, { ...updateUserTokenDto });
  }

  remove(id: number) {
    return this.userTokenRepository.delete(id);
  }
}
