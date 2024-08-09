import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  createRole(createUserRoleDto: { id: number; name: string }) {
    return this.prisma.role.create({ data: createUserRoleDto });
  }

  findAllRoles() {
    return this.prisma.role.findMany();
  }

  update(id: number, updateUserRoleDto: any) {
    return this.prisma.role.update({
      where: { id },
      data: updateUserRoleDto,
    });
  }

  remove(id: number) {
    return this.prisma.role.delete({
      where: { id },
    });
  }
}
