import { VotePostInput } from './../../model';
import { Roles } from 'src/decorators/roles.decorator';
import { Vote } from './../entities/vote';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { UserRole } from 'src/helpers/constant';
import { CurrentUser } from 'src/decorators/user.decorator';
import { VoteService } from '../service/vote.service';

@Resolver(() => Vote)
export class VoteResolver {
  constructor(private voteService: VoteService) {}

  // ============== MUTATION ============== \\
  // ====== POST ANSWER ====== \\
  @UseGuards(GqlAuthGuard)
  @Roles(UserRole.USER)
  @Mutation(() => Vote)
  async votePost(
    @Args('input') input: VotePostInput,
    @CurrentUser() user,
  ): Promise<Vote> {
    return await this.voteService.votePost(input, user);
  }
}
