import { User } from './user';
import { PostType, VoteType } from './../../helpers/constant';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './question';
import { Answer } from './answer';
import { Comment } from './comment';

@ObjectType()
@Entity('vote')
export class Vote {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: number;

  @Column({ nullable: true })
  @Field(() => VoteType, { nullable: true })
  voteType: VoteType;

  @Column({ nullable: true })
  @Field(() => VoteType, { nullable: true })
  postType: PostType;

  @Column({ nullable: true })
  @Field({ nullable: true })
  question_Id: number;

  @ManyToOne(() => Question, (u) => u.id, { nullable: true })
  @Field(() => Question, { nullable: true })
  question: Question;

  @Column({ nullable: true })
  @Field({ nullable: true })
  answer_Id: number;

  @ManyToOne(() => Answer, (u) => u.id, { nullable: true })
  @Field(() => Answer, { nullable: true })
  answer: Answer;

  @Column({ nullable: true })
  @Field({ nullable: true })
  comment_Id: number;

  @ManyToOne(() => Comment, (u) => u.id, { nullable: true })
  @Field(() => Comment, { nullable: true })
  comment: Comment;

  @Column()
  @Field({ nullable: true })
  creator_id: string;

  @ManyToOne(() => User, (u) => u.id, { nullable: true })
  @Field(() => User, { nullable: true })
  creator: User;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Field({ nullable: true })
  logCreatedAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  @Field({ nullable: true })
  logUpdatedAt: Date;
}
