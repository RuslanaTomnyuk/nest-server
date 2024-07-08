import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import bcrypt from 'bcrypt';

import { MailService } from 'src/auth/services/nodemailer.service';

import { CreateUserDto } from '../dto/create-user.dto';
import { ChangePasswordDto } from '../../auth/dto/change-password.dto';

import { Role } from 'src/role/entities/role.entity';
import { User } from '../entities/user.entity';

import {
  UpdateUserParams,
  UpdateUserProfileParams,
} from 'src/interfaces/dtoClasses';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private mailService: MailService,
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

    await this.userRepository.save(newUser);

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
    res,
  ) {
    if (
      !updateUserDetails.username ||
      !updateUserDetails.email ||
      !updateUserDetails.password
    ) {
      throw new BadRequestException(
        'Username, email and password are required.',
      );
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

    if (!isPasswordValid) {
      throw new HttpException(
        'The current password you provided is not valid!',
        HttpStatus.FORBIDDEN,
      );
    }

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

    const role = 'Admin';

    const hasEmailChanged = updateUserDetails.email !== userExists.email;

    if (role === 'Admin') {
      isPasswordValid &&
        (await this.userRepository.update(
          { id: user.id },
          {
            password: hashedPassword,
            username: updateUserDetails.username,
            email: updateUserDetails.email,
          },
        ));

      try {
        if (hasEmailChanged) {
          await this.mailService.changeEmailNotification(
            updateUserDetails.username,
            updateUserDetails.email,
          );
        }
      } catch (error) {
        console.log('Error while sending email', error);
      }

      res.status(200).json({
        status: 200,
        error: false,
        message: 'User updated Successfully',
      });
    } else {
      throw new HttpException(
        'Forbidden: Only Admin users can update the user!',
        HttpStatus.FORBIDDEN,
      );
    }
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

    const hashNewPassword = await bcrypt.hash(password, +process.env.SALT);

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
