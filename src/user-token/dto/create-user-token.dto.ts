import { IsNotEmpty } from 'class-validator';

export class CreateUserTokenDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  token: string;
}
