import { QuestionService } from './../service/question.service';
import { Question } from './../entities/question';
import { GqlAuthGuard } from './../../auth/auth.guard';
import { AskQuestionInput } from 'src/model';
import {
  Args,
  Resolver,
  Mutation,
  ResolveField,
  Parent,
  Query,
} from '@nestjs/graphql';
import { CurrentUser } from 'src/decorators/user.decorator';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/helpers/constant';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Tag } from '../entities/tag';

@Resolver(() => Question)
export class QuestionResolver {
  constructor(
    private questionService: QuestionService,
    @InjectRepository(Tag) private tagRepo: Repository<Tag>,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Roles(UserRole.USER)
  @Mutation(() => Question)
  async askQuestion(
    @Args('input') input: AskQuestionInput,
    @CurrentUser() user,
  ): Promise<Question> {
    return await this.questionService.askQuestion(input, user);
  }

  @Mutation(() => Boolean)
  async viewQuestion(@Args('id') id: number): Promise<Boolean> {
    return await this.questionService.viewQuestion(id);
  }

  @Query(() => Question)
  async getQuestion(@Args('id') id: number): Promise<Question> {
    return await this.questionService.getQuestion(id);
  }

  @ResolveField()
  async tags(@Parent() ques: Question): Promise<Tag[]> {
    return await this.tagRepo.find({ where: { id: In(ques.tags_ids) } });
  }
}
