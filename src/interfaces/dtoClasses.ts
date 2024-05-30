import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserParams {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  role: string;
}

export class UpdateUserParams {
  username: string;

  @IsEmail()
  email: string;
}

export class UpdateUserProfileParams {
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class CreateUserProfileParams {
  firstName: string;
  lastName: string;
  age: number;
  dob: string;
}

export class CreateUserPostParams {
  title: string;
  description: string;
}
