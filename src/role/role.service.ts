import { Injectable } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  createRole(createUserRoleDto: { id: number; name: string }) {
    return this.roleRepository.save(createUserRoleDto);
  }

  findAllRoles() {
    return `This action returns all userRoles`;
  }

  findUserRole(role: string) {
    return this.roleRepository.findOneBy({ name: role });
  }

  update(id: number, updateUserRoleDto: any) {
    return `This action updates a #${id} userToken`;
  }

  remove(id: number) {
    return this.roleRepository.delete({ id });
  }
}
