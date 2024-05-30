import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import {
  CreateUserParams,
  UpdateUserParams,
  UpdateUserProfileParams,
} from 'src/interfaces/dtoClasses';
import { CreateUserDto } from '../dto/create-user.dto';
import { Role } from 'src/role/entities/role.entity';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    // private readonly roleService: RoleService,
  ) {}

  async createUser(userDetails: CreateUserDto, userRole: Role) {
    const { username, email, password, confirmPassword } = userDetails;

    if (!username || !email || !password || !confirmPassword || !userRole) {
      // TODO
      // change the message error to required
      throw new BadRequestException('All fields should be filled');
    }

    const userExists = await this.findUserByEmail(email);

    if (userExists) {
      throw new BadRequestException('Email already in use');
    }

    if (userRole.name !== 'Admin') {
      throw new ForbiddenException();
    }

    if (password !== confirmPassword) {
      throw new BadRequestException(
        'Password and ConfirmPassword do not match!',
      );
    }

    const hashedPassword = await bcrypt.hash(password, +process.env.SALT);

    await this.roleRepository.save(userRole);

    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      roles: [userRole],
    });

    await this.userRepository.save(newUser);

    const { password: _, ...userData } = newUser;
    return userData;
  }

  async findAllUsers() {
    return await this.userRepository.find({
      relations: {
        roles: true,
      },
    });
  }

  async findUserById(id: number) {
    const userExists = await this.userRepository.findOneBy({ id });

    if (!userExists) {
      throw new NotFoundException(`We could not find a user #${id}.`);
    }

    return await this.userRepository.findOneBy({ id });
  }

  async findUserByEmail(email: string) {
    // const userWithRole = await this.userRepository.find({
    //   relations: {
    //     roles: true,
    //   },
    // });
    // console.log('userWithRole', userWithRole);

    return await this.userRepository.findOneBy({ email });
  }

  async updateUser(id: number, updateUserDetails: UpdateUserParams) {
    const userExists = await this.userRepository.findOneBy({ id });

    if (!userExists) {
      throw new HttpException(
        'We could not find the user with a given email',
        HttpStatus.NOT_FOUND,
      );
    }

    if (updateUserDetails.email !== userExists.email) {
      const emailExists = await this.userRepository.findOneBy({
        email: updateUserDetails.email,
      });
      console.log('emailExists', emailExists);

      if (emailExists) {
        throw new HttpException(
          'That email is already registered',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return await this.userRepository.update({ id }, { ...updateUserDetails });
  }

  async updateUserProfile(
    user: User,
    updateUserDetails: UpdateUserProfileParams,
  ) {
    if (
      !updateUserDetails.username ||
      !updateUserDetails.email ||
      !updateUserDetails.password
    ) {
      throw new BadRequestException('Username and password are required.');
    }
    const userExists = await this.findUserById(user.id);

    if (!userExists) {
      throw new HttpException(
        'We could not find the user with a given email',
        HttpStatus.NOT_FOUND,
      );
    }
    const isPasswordValid = await bcrypt.compare(
      updateUserDetails.password,
      userExists.password,
    );

    if (isPasswordValid && updateUserDetails.email !== userExists.email) {
      const emailExists = await this.userRepository.findOneBy({
        email: updateUserDetails.email,
      });

      if (emailExists) {
        throw new HttpException(
          'That email is already registered',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const hashedPassword = await bcrypt.hash(
      updateUserDetails.password,
      +process.env.SALT,
    );

    return (
      isPasswordValid &&
      (await this.userRepository.update(
        { id: user.id },
        {
          password: hashedPassword,
          username: updateUserDetails.username,
          email: updateUserDetails.email,
        },
      ))
    );
  }

  async removeUser(id: number) {
    const userExists = await this.userRepository.findOneBy({ id });

    if (!userExists) {
      throw new NotFoundException(`We could not find a user #${id}.`);
    }

    return await this.userRepository.delete({ id });
  }
}
