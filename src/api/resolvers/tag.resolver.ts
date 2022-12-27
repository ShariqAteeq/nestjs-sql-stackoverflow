import { GqlAuthGuard } from './../../auth/auth.guard';
import { AddTagInput, ListTagsFilter } from 'src/model';
import { TagService } from './../service/tag.service';
import { Tag } from './../entities/tag';
import {
  Args,
  Resolver,
  Mutation,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CurrentUser } from 'src/decorators/user.decorator';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/helpers/constant';
import { Pagination } from 'src/paginate/pagination';
import { Question } from '../entities/question';

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

  // ============== QUERY ============== \\
  // ====== LIST TAGS ====== \\
  @Query(() => [Tag])
  async listTags(
    @Args('filter', { nullable: true }) filter: ListTagsFilter,
  ): Promise<Tag[]> {
    return await this.tagService.listTags(filter);
  }

  // ====== GET TAGS ====== \\
  @Query(() => Tag)
  async getTag(@Args('id') id: number): Promise<Tag> {
    return await this.tagService.getTag(id);
  }

  @ResolveField()
  async askedTodayQuestionCount(@Parent() tag: Tag): Promise<number> {
    return await this.tagService.askedTodayQuestionCount(tag.id);
  }
  @ResolveField()
  async thisWeekQuestionCount(@Parent() tag: Tag): Promise<number> {
    return await this.tagService.thisWeekQuestionCount(tag.id);
  }
  @ResolveField()
  async totalQuestionCount(@Parent() tag: Tag): Promise<number> {
    return await this.tagService.totalQuestionCount(tag.id);
  }
  @ResolveField()
  async questionsList(
    @Parent() tag: Tag,
    @Args('filter', { nullable: true }) filter: ListTagsFilter,
  ): Promise<Pagination<Question>> {
    // console.log('args', filter);
    return await this.tagService.listTagQuestions(
      tag.id,
      filter?.quesLimit,
      filter?.quesOffset,
    );
  }
}
