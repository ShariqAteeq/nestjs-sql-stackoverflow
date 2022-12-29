import { UserRole } from 'src/helpers/constant';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(private authService: AuthService, private reflector: Reflector) {
    super({ passReqToCallback: true });
  }
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);

    const authHeader = ctx.getContext().req?.headers?.authorization as string;
    // console.log('authHeader', authHeader);
    if (!authHeader) {
      throw new HttpException('Token not Found', HttpStatus.NOT_FOUND);
    }

    const token = authHeader.split(' ')[1];
    // console.log('token', token);

    const isTokenValid = this.authService.validateToken(token);
    // console.log('isTokenValid', isTokenValid);

    if (isTokenValid === 'TokenExpiredError') {
      throw new HttpException('Token is Expired', HttpStatus.BAD_REQUEST);
    }

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('role', [
      context.getHandler(),
      context.getClass(),
    ]);

    const user = this.authService.getUserFromAccessToken(token);
    // console.log('user', user);

    if (!requiredRoles) {
      return ctx.getContext().req;
    }

    if (!requiredRoles?.includes(user?.role))
      throw new HttpException('Forbidden Resource', HttpStatus.UNAUTHORIZED);

    return ctx.getContext().req;
  }
}
