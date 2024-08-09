import { IsBoolean, IsString } from 'class-validator';

export class CreateJobPositionDto {
  @IsString()
  company: string;

  @IsString()
  logo: string;

  @IsBoolean()
  new: boolean;

  @IsBoolean()
  featured: boolean;

  @IsString()
  position: string;

  @IsString()
  role: string;

  @IsString()
  level: string;

  @IsString()
  postedAt: string;

  @IsString()
  contract: string;

  @IsString()
  location: string;

  @IsString()
  languages: string[];

  @IsString()
  tools: string[];
}
