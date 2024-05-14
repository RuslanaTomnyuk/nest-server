import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class JobPosition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company: string;

  @Column()
  logo: string;

  @Column()
  newPosition: boolean;

  @Column()
  featured: boolean;

  @Column()
  position: string;

  @Column()
  role: string;

  @Column()
  level: string;

  @Column()
  postedAt: string;

  @Column()
  contract: string;

  @Column()
  location: string;

  @Column('simple-array')
  languages: string[];

  @Column('simple-array')
  tools: string[];
}
