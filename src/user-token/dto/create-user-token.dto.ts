import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class CreateUserTokenDto {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  token: string;
}
