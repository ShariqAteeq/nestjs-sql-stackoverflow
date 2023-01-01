import { Action } from './../../helpers/constant';
import { VotePostInput } from './../../model';
import { Roles } from 'src/decorators/roles.decorator';
import { Vote } from './../entities/vote';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { UserRole } from 'src/helpers/constant';
import { CurrentUser } from 'src/decorators/user.decorator';
import { VoteService } from '../service/vote.service';
import { CaslAbilityFactory } from '../service/caslAbility.service';

@Resolver(() => Vote)
export class VoteResolver {
  constructor(
    private voteService: VoteService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  // ============== MUTATION ============== \\
  // ====== UP-VOTE POST ====== \\
  @UseGuards(GqlAuthGuard)
  @Roles(UserRole.USER)
  @Mutation(() => Vote)
  async upVotePost(
    @Args('input') input: VotePostInput,
    @CurrentUser() user,
  ): Promise<Vote> {
    const ability = await this.caslAbilityFactory.createForUser(user);
    if (ability.can(Action.Vote, 'all')) {
      return await this.voteService.upVotePost(input, user);
    }
  }

  // ======  DOWN-VOTE POST ====== \\
  @UseGuards(GqlAuthGuard)
  @Roles(UserRole.USER)
  @Mutation(() => Vote)
  async downvotePost(
    @Args('input') input: VotePostInput,
    @CurrentUser() user,
  ): Promise<Vote> {
    return await this.voteService.downvotePost(input, user);
  }

  // ======  REMOVE VOTE FROM POST ====== \\
  @UseGuards(GqlAuthGuard)
  @Roles(UserRole.USER)
  @Mutation(() => Boolean)
  async removeVote(
    @Args('id') id: number,
    @CurrentUser() user,
  ): Promise<Boolean> {
    return await this.voteService.removeVote(id, user);
  }
}
