import { Answer } from './../entities/answer';
import { AnswerService } from './../service/answer.service';
import { GqlAuthGuard } from './../../auth/auth.guard';
import { PostAnswerInput } from 'src/model';
import { Tag } from './../entities/tag';
import { Args, Resolver, Mutation } from '@nestjs/graphql';
import { CurrentUser } from 'src/decorators/user.decorator';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/helpers/constant';

@Resolver(() => Tag)
export class AnswerResolver {
  constructor(private answerService: AnswerService) {}

  // ============== MUTATION ============== \\
  // ====== POST ANSWER ====== \\
  @UseGuards(GqlAuthGuard)
  @Roles(UserRole.USER)
  @Mutation(() => Answer)
  async postAnswer(
    @Args('input') input: PostAnswerInput,
    @CurrentUser() user,
  ): Promise<Answer> {
    return await this.answerService.postAnswer(input, user);
  }
}
