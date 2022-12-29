import { VoteType, TagFilter } from './helpers/constant';
import { Question } from './api/entities/question';
import { Answer } from './api/entities/answer';
import { createUnionType, Field, InputType, ObjectType } from '@nestjs/graphql';
import { PostType, UserRole } from 'src/helpers/constant';
import { Comment } from './api/entities/comment';

@InputType()
export class UserSignUpInput {
  @Field()
  name: string;
  @Field()
  email: string;
  @Field()
  password: string;
  @Field(() => UserRole)
  role: UserRole;
}

@InputType()
export class ConfirmSignUpInput {
  @Field()
  code: string;
  @Field()
  email: string;
}

@InputType()
export class AddTagInput {
  @Field()
  name: string;
  @Field({ nullable: true })
  desc: string;
}
@InputType()
export class AskQuestionInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  desc: string;

  @Field({ nullable: true })
  canIAnswer: Boolean;

  @Field(() => [Number])
  tags: number[];
}
@InputType()
export class PostAnswerInput {
  @Field()
  desc: string;
  @Field()
  questionId: number;
}
@InputType()
export class AddCommentInput {
  @Field()
  text: string;
  @Field(() => PostType)
  postType: PostType;
  @Field({ nullable: true })
  questionId: number;
  @Field({ nullable: true })
  answerId: number;
}
@InputType()
export class VotePostInput {
  @Field({ nullable: true })
  questionId: number;
  @Field({ nullable: true })
  answerId: number;
  @Field({ nullable: true })
  commentId: number;
  @Field(() => PostType)
  postType: PostType;
  @Field(() => VoteType, { nullable: true })
  voteType: VoteType;
}

export const PostUnion = createUnionType({
  name: 'PostUnion',
  types: () => [Comment, Answer, Question] as const,
});

export const TagPostsUnion = createUnionType({
  name: 'TagPostsUnion',
  types: () => [Answer, Question] as const,
});

@InputType()
export class ListTagsFilter {
  @Field(() => TagFilter, { nullable: true })
  filterBy: TagFilter;
  @Field({ nullable: true })
  query: string;
  @Field({ nullable: true })
  quesLimit: number;
  @Field({ nullable: true })
  quesOffset: number;
}

@InputType()
export class ListQuestionFilter {
  @Field({ nullable: true })
  myTags: boolean;
  @Field({ nullable: true })
  unAnswered: boolean;
  @Field({ nullable: true })
  answered: boolean;
  @Field({ nullable: true })
  noAcceptedAnswer: boolean;
  @Field({ nullable: true })
  sortByNewest: boolean;
  @Field({ nullable: true })
  sortByRecentActivity: boolean;
}

@ObjectType()
export class WithPagination {
  @Field()
  total: number;

  @Field()
  page_total: number;

  @Field()
  limit: number;

  @Field()
  offset: number;
}

@ObjectType()
export class ListQuestionsOutput extends WithPagination {
  @Field(() => [Question])
  results: Question[];
}

@ObjectType()
export class ListTagsQuestion extends WithPagination {
  @Field(() => [Question])
  results: Question[];
}
