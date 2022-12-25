import { Field, InputType } from '@nestjs/graphql';
import { PostType, UserRole } from 'src/helpers/constant';

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
