import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';

import bcrypt from 'bcrypt';

import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';

import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(userDetails: CreateUserDto) {
    const { username, email, password, role } = userDetails;

    if (!username || !email || !password || !role) {
      throw new BadRequestException('All fields are required');
    }

    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new BadRequestException('Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(password, +process.env.SALT);

    const newUser = await this.saveUser({
      username,
      email,
      password: hashedPassword,
    });

    let userRole = await this.prisma.role.findUnique({
      where: { id: newUser.id },
    });

    if (!userRole) {
      userRole = await this.prisma.role.create({
        data: {
          name: role,
        },
      });
    }

    await this.prisma.user_roles_role.create({
      data: {
        userId: newUser.id,
        roleId: userRole.id,
      },
    });

    try {
      await this.mailService.createUserNotification(
        userDetails.username,
        userDetails.email,
      );
    } catch (error) {
      console.log('Error while sending email', error);
    }

    const { password: _, ...userData } = newUser;

    return {
      userData,
      status: 201,
      success: true,
      message:
        'Thank you for registration with us. Your account has been successfully created.',
    };
  }

  findAllUsers() {
    return this.prisma.user.findMany();
  }

  async findUserById(id: number) {
    const userExists = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      throw new NotFoundException(`We could not find a user #${id}.`);
    }

    return userExists;
  }

  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  saveUser(user: Prisma.userCreateInput) {
    return this.prisma.user.create({ data: user });
  }

  async updateUser(id: number, updateUserDetails: UpdateUserDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      throw new HttpException(
        'We could not find the user with a given email',
        HttpStatus.NOT_FOUND,
      );
    }

    if (updateUserDetails.email !== userExists.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: updateUserDetails.email },
      });

      if (emailExists) {
        throw new HttpException(
          'That email is already registered',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return await this.prisma.user.update({
      where: { id },
      data: { ...updateUserDetails },
    });
  }

  async removeUser(id: number) {
    const userExists = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      throw new NotFoundException(`We could not find a user #${id}.`);
    }

    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
