import { Injectable } from '@nestjs/common';
import { CreateUserTokenDto } from './dto/create-user-token.dto';
import { UpdateUserTokenDto } from './dto/update-user-token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from './entities/user-token.entity';
import { Repository } from 'typeorm';

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
    return `This action returns all userToken`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userToken`;
  }

  update(id: number, updateUserTokenDto: UpdateUserTokenDto) {
    return this.userTokenRepository.update(id, { ...updateUserTokenDto });
  }

  remove(id: number) {
    return `This action removes a #${id} userToken`;
  }
}
