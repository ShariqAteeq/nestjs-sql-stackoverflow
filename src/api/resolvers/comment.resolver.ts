import { CommentService } from './../service/comment.service';
import { GqlAuthGuard } from './../../auth/auth.guard';
import { AddCommentInput } from 'src/model';
import { Args, Resolver, Mutation } from '@nestjs/graphql';
import { CurrentUser } from 'src/decorators/user.decorator';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/helpers/constant';
import { Comment } from '../entities/comment';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private commentService: CommentService) {}

  // ============== MUTATION ============== \\
  // ====== ADD COMMENT ====== \\
  @UseGuards(GqlAuthGuard)
  @Roles(UserRole.USER)
  @Mutation(() => Comment)
  async addComment(
    @Args('input') input: AddCommentInput,
    @CurrentUser() user,
  ): Promise<Comment> {
    return await this.commentService.addComment(input, user);
  }
}
