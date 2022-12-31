import { PostUnion } from './../../model';
import { GqlAuthGuard } from './../../auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { ReputationService } from './../service/reputation.service';
import { Reputation } from './../entities/reputation';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/decorators/user.decorator';

@Resolver(() => Reputation)
export class ReputationResolver {
  constructor(private reputationService: ReputationService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Reputation])
  async listReputations(@CurrentUser() user): Promise<Reputation[]> {
    return await this.reputationService.listReputations(user);
  }

  @ResolveField()
  async post(@Parent() rep: Reputation): Promise<typeof PostUnion> {
    const res = await this.reputationService.getPostAccToType(rep);
    return res;
  }
}
