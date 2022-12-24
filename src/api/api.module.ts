import { TagResolver } from './resolvers/tag.resolver';
import { TagService } from './service/tag.service';
import { Tag } from './entities/tag';
import { UserResolver } from './resolvers/user.resolver';
import { HelperService } from './service/helper.service';
import { UserService } from 'src/api/service/user.service';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Token } from './entities/token';
import { User } from './entities/user';
import { Question } from './entities/question';
import { Answer } from './entities/answer';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Token]),
    TypeOrmModule.forFeature([Tag]),
    TypeOrmModule.forFeature([Question]),
    TypeOrmModule.forFeature([Answer]),
  ],
  providers: [
    UserService,
    HelperService,
    TagService,
    TagResolver,
    UserResolver,
  ],
  exports: [],
})
export class ApiModule {}
