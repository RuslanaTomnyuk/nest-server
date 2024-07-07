import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

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
    return this.roleRepository.find();
  }

  findUserRole(role: string) {
    return this.roleRepository.findOneBy({ name: role });
  }

  update(id: number, updateUserRoleDto: any) {
    return this.roleRepository.update(id, updateUserRoleDto);
  }

  remove(id: number) {
    return this.roleRepository.delete({ id });
  }
}
