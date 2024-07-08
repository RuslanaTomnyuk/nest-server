import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RoleService } from 'src/role/role.service';
import { RoleModule } from 'src/role/role.module';
import { JwtModule } from '@nestjs/jwt';
import { Role } from 'src/role/entities/role.entity';
import { MailService } from 'src/auth/services/nodemailer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.register({}),
    RoleModule,
  ],
  controllers: [UserController],
  providers: [UserService, RoleService, MailService],
  exports: [UserService, TypeOrmModule, RoleService],
})
export class UserModule {}

// middlewares
// export class UserModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(AuthMiddleware).forRoutes(
//       {
//         path: '/job-list',
//         method: RequestMethod.GET,
//       },
//       {
//         path: '/profile',
//         method: RequestMethod.GET,
//       },
//     );
//     // .forRoutes(UserController); // works for all routes of this controller
//     /*
//      .exclude({
//        {
//           path: '/auth/user/id', // should be the whole route
//           method: RequestMethod.DELETE,
//         },
//       }) // excludes this path from controller
//       .forRoutes(UserController)
//     */
//   }
// }
