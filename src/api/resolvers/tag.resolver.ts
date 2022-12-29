import { User } from 'src/api/entities/user';
import { GqlAuthGuard } from './../../auth/auth.guard';
import { AddTagInput, ListTagsFilter, TagPostsUnion } from 'src/model';
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

  // ============== MUTATION ============== \\
  // ====== ADD TAGS BY ADMIN ====== \\
  @UseGuards(GqlAuthGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Tag)
  async addTag(
    @Args('input') input: AddTagInput,
    @CurrentUser() user,
  ): Promise<Tag> {
    return await this.tagService.addTag(input, user);
  }

  // ============== MUTATION ============== \\
  // ====== WATCH TAG ====== \\
  @UseGuards(GqlAuthGuard)
  @Roles(UserRole.USER)
  @Mutation(() => User)
  async watchTag(@Args('id') id: number, @CurrentUser() user): Promise<User> {
    return await this.tagService.watchTag(id, user);
  }

  // ====== IGNORE TAG ====== \\
  @UseGuards(GqlAuthGuard)
  @Roles(UserRole.USER)
  @Mutation(() => User)
  async ignoreTag(@Args('id') id: number, @CurrentUser() user): Promise<User> {
    return await this.tagService.ignoreTag(id, user);
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

  @UseGuards(GqlAuthGuard)
  @ResolveField()
  async userPostCount(
    @Parent() tag: Tag,
    @CurrentUser() user,
  ): Promise<number> {
    return await this.tagService.userPostCountOnTag(tag.id, user);
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField()
  async tagPosts(
    @Parent() tag: Tag,
    @CurrentUser() user,
  ): Promise<Array<typeof TagPostsUnion>> {
    return await this.tagService.getTagPosts(tag.id, user);
  }

  @ResolveField()
  async questionsList(
    @Parent() tag: Tag,
    @Args('filter', { nullable: true }) filter: ListTagsFilter,
  ): Promise<Pagination<Question>> {
    return await this.tagService.listTagQuestions(
      tag.id,
      filter?.quesLimit,
      filter?.quesOffset,
    );
  }
}
