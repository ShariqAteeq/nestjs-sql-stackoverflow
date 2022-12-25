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

  // ============== MUTATION ============== \\
  // ====== ASK QUESTION ====== \\
  @UseGuards(GqlAuthGuard)
  @Roles(UserRole.USER)
  @Mutation(() => Question)
  async askQuestion(
    @Args('input') input: AskQuestionInput,
    @CurrentUser() user,
  ): Promise<Question> {
    return await this.questionService.askQuestion(input, user);
  }

  // ====== SELECT BEST ANSWER FOR QUESTION ====== \\
  @UseGuards(GqlAuthGuard)
  @Roles(UserRole.USER)
  @Mutation(() => Question)
  async selectBestAnswer(
    @Args('questionId') questionId: number,
    @Args('answerId') answerId: number,
    @CurrentUser() user,
  ): Promise<Question> {
    return await this.questionService.selectBestAnswer(
      answerId,
      questionId,
      user,
    );
  }

  // ====== VIEW QUESTION ====== \\
  @Mutation(() => Boolean)
  async viewQuestion(@Args('id') id: number): Promise<Boolean> {
    return await this.questionService.viewQuestion(id);
  }

  // ============== QUERY ============== \\
  // ====== GET SINGLE QUESTION ====== \\
  @Query(() => Question)
  async getQuestion(@Args('id') id: number): Promise<Question> {
    return await this.questionService.getQuestion(id);
  }

  // ====== FIELD RESOLVERS ====== \\
  @ResolveField()
  async tags(@Parent() ques: Question): Promise<Tag[]> {
    return await this.tagRepo.find({ where: { id: In(ques.tags_ids) } });
  }
}
