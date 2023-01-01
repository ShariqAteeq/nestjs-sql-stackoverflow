import { UserContextService } from './service/context.service';
import { ReputationResolver } from './resolvers/reputation.resolver';
import { ReputationService } from './service/reputation.service';
import { Reputation } from './entities/reputation';
import { VoteService } from './service/vote.service';
import { VoteResolver } from './resolvers/vote.resolver';
import { Vote } from './entities/vote';
import { CommentResolver } from './resolvers/comment.resolver';
import { AnswerService } from './service/answer.service';
import { QuestionService } from './service/question.service';
import { QuestionResolver } from './resolvers/question.resolver';
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
import { AnswerResolver } from './resolvers/answer.resolver';
import { Comment } from './entities/comment';
import { CommentService } from './service/comment.service';
import { VoteSubscriber } from './subscribers/vote.subscriber';
import { CaslAbilityFactory } from './service/caslAbility.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Token]),
    TypeOrmModule.forFeature([Tag]),
    TypeOrmModule.forFeature([Question]),
    TypeOrmModule.forFeature([Answer]),
    TypeOrmModule.forFeature([Comment]),
    TypeOrmModule.forFeature([Vote]),
    TypeOrmModule.forFeature([Reputation]),
  ],
  providers: [
    UserService,
    HelperService,
    TagService,
    TagResolver,
    UserResolver,
    QuestionResolver,
    QuestionService,
    AnswerService,
    AnswerResolver,
    CommentService,
    CommentResolver,
    VoteResolver,
    VoteService,
    VoteSubscriber,
    ReputationService,
    ReputationResolver,
    UserContextService,
    CaslAbilityFactory,
  ],
  exports: [UserContextService],
})
export class ApiModule {}
