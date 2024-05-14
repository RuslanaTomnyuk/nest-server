import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { UserTokenModule } from './user-token/user-token.module';
import { JobPositionModule } from './job-position/job-position.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Rusia123',
      database: 'jobs',
      entities: [User],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserModule,
    UserTokenModule,
    JobPositionModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
