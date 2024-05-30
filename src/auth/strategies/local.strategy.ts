import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';

export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  validate(email: string, password: string) {
    console.log('Inside LocalStrategy');
    const user = this.authService.validateUser({ email, password });
    console.log('local strategy - user', user);

    // if (!user) throw new UnauthorizedException();
    return user;
  }
}
