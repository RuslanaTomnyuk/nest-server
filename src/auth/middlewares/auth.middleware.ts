import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
// import { UserService } from '../../user/services/user.service/';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req, res, next: NextFunction) {
    console.log('middleware', req.headers, res.status);
    // try {
    const [type, accessToken] = req.headers.authorization?.split(' ') ?? [];
    type === 'Bearer' ? accessToken : undefined;

    // const accessToken = req.header('Authorization')?.replace('Bearer ', '');
    if (!accessToken) {
      return res.status(403).send({
        success: false,
        error: 'No Authentication Token Provided.',
      });
    }

    console.log('accessToken', accessToken);
    // console.log('authorization, token', authorization, token);

    // const decodedToken: any = jwt.verify(
    //   accessToken,
    //   process.env.ACCESS_TOKEN_SECRET,
    // );
    //   const user = await this.userRe({ id: +decodedToken.id });
    //   if (!user) {
    //     return res.status(401).json({
    //       message: 'Invalid Access Token!',
    //     });
    //   }
    //   const { password, confirmPassword, ...userData } = user;
    //   req.user = userData;
    // next();
    // } catch (error) {
    //   res.status(401).json({
    //     success: false,
    //     message: 'Unauthorized!',
    //   });
    // }
  }
}
