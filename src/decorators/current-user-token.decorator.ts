import {
  ExecutionContext,
  NotFoundException,
  createParamDecorator,
} from '@nestjs/common';

export const GetCurrentUserToken = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies.auth;
    if (!refreshToken) {
      throw new NotFoundException('There is no such token!', {
        cause: new Error(),
        description: 'There is no such token!',
      });
    }
    return refreshToken;
  },
);
