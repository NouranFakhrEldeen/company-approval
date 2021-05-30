import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {config} from '../../../infrastructure';
// interfaces
import { IJwtPayload } from '../../interfaces';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || config.jwt.secret,
    });
  }

  public async validate(payload: IJwtPayload, next) {
    // ToDo: integrate with identity service
    // this can be used for more security by checking if the user with this payload is really exist
    // const exist: boolean = await this.authService.findUserExistance(payload.id);
    // if (!exist) {
    //   return next(new UnauthorizedException(), false);
    // }
    next(null, payload);
  }
}
