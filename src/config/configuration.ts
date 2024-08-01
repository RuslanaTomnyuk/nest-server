import { registerAs } from '@nestjs/config';
import { User } from '../user/entities/user.entity';

export default registerAs('database', () => ({
  type: 'mysql',
  host: +process.env.DB_HOST,

  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
  synchronize: true,
  autoLoadEntities: true,
}));
