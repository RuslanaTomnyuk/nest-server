import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import bcrypt from 'bcrypt';

import { MailService } from '../mail/mail.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';

import { Role } from '../role/entities/role.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(userDetails: CreateUserDto, userRole: Role) {
    const { username, email, password, confirmPassword } = userDetails;

    if (!username || !email || !password || !confirmPassword || !userRole) {
      throw new BadRequestException('All fields are required');
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

    const { roles, ...createdUser } = newUser;

    await this.userRepository.save(createdUser);

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
    return await this.userRepository.findOneBy({ email });
  }

  async saveUser(user: User) {
    return await this.userRepository.save(user);
  }

  async updateProfile(id: number, updateUserDetails: Partial<User>) {
    return await this.userRepository.update({ id }, { ...updateUserDetails });
  }

  async updateUser(id: number, updateUserDetails: UpdateUserDto) {
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

      if (emailExists) {
        throw new HttpException(
          'That email is already registered',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return await this.userRepository.update({ id }, { ...updateUserDetails });
  }

  async changePassword(user: User, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, password } = changePasswordDto;

    const userExists = await this.findUserById(user.id);

    if (!userExists) {
      throw new HttpException(
        'We could not find the user with a given email',
        HttpStatus.NOT_FOUND,
      );
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      userExists.password,
    );

    if (!isCurrentPasswordValid) {
      throw new HttpException(
        'The current password you provided is not valid!',
        HttpStatus.FORBIDDEN,
      );
    }

    const hashNewPassword = await bcrypt.hash(
      password,
      +this.configService.get<string>('SALT'),
    );

    const role = 'Admin';
    if (role === 'Admin') {
      isCurrentPasswordValid &&
        (await this.userRepository.update(
          { id: user.id },
          {
            password: hashNewPassword,
            email: user.email,
          },
        ));

      throw new HttpException('User updated Successfully', HttpStatus.CREATED);
    } else {
      throw new HttpException(
        'Forbidden: Only Admin users can update the user!',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async removeUser(id: number) {
    const userExists = await this.userRepository.findOneBy({ id });

    if (!userExists) {
      throw new NotFoundException(`We could not find a user #${id}.`);
    }

    return await this.userRepository.delete({ id });
  }
}
