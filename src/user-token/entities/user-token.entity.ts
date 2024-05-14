import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserToken {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  token: string;
}
