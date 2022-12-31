import { UserContextService } from './../api/service/context.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from 'src/helpers/jwtConstant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userContextService: UserContextService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    console.log('payload', payload);
    this.userContextService.userId = payload?.userId;
    console.log('user in pay', this.userContextService.userId);
    return payload;
  }
}
