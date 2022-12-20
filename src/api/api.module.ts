import { UserResolver } from './resolvers/user.resolver';
import { HelperService } from './service/helper.service';
import { UserService } from 'src/api/service/user.service';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Token } from './entities/token';
import { User } from './entities/user';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Token]),
  ],
  providers: [UserService, HelperService, UserResolver],
  exports: [],
})
export class ApiModule {}
