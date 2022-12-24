import { GqlAuthGuard } from './../../auth/auth.guard';
import { AddTagInput } from 'src/model';
import { TagService } from './../service/tag.service';
import { Tag } from './../entities/tag';
import { Args, Resolver, Mutation } from '@nestjs/graphql';
import { CurrentUser } from 'src/decorators/user.decorator';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/helpers/constant';

@Resolver(() => Tag)
export class TagResolver {
  constructor(private tagService: TagService) {}

  @UseGuards(GqlAuthGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Tag)
  async addTag(
    @Args('input') input: AddTagInput,
    @CurrentUser() user,
  ): Promise<Tag> {
    return await this.tagService.addTag(input, user);
  }
}
