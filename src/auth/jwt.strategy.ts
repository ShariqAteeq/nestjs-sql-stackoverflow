import { UserContextService } from './../api/service/context.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from 'src/helpers/jwtConstant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(public userContextService: UserContextService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    console.log('payload', payload);
    this.userContextService.userId = payload?.userId;
    return payload;
  }
}
