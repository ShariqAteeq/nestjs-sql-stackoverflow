import { Question } from './question';
import { User } from 'src/api/entities/user';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ListTagsQuestion, TagPostsUnion } from 'src/model';

@ObjectType()
@Entity('tag')
export class Tag {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: number;

  @Column()
  @Field({ nullable: true })
  name: string;

  @Column({ nullable: true, length: 10000 })
  @Field({ nullable: true })
  desc: string;

  @Column()
  @Field({ nullable: true })
  creator_id: string;

  @ManyToOne(() => User, (u) => u.id, { nullable: true })
  @Field(() => User, { nullable: true })
  creator: User;

  // @ManyToOne(() => Question, { nullable: true })
  // @Field(() => Question, { nullable: true })
  // question: Question;

  @ManyToMany(() => Question, (q) => q.tags, { nullable: true })
  // @Field(() => [Question], { nullable: true })
  @JoinTable()
  questions: Question[];

  @ManyToMany(() => User, (q) => q.watchedTags, { nullable: true })
  @Field(() => [User], { nullable: true })
  users: User[];

  @Field(() => ListTagsQuestion, { nullable: true })
  questionsList: ListTagsQuestion;

  @Field({ nullable: true })
  totalQuestionCount: number;

  @Field({ nullable: true })
  askedTodayQuestionCount: number;

  @Field({ nullable: true })
  thisWeekQuestionCount: number;

  @Field({ nullable: true })
  userPostCount: number;

  @Field(() => [TagPostsUnion], { nullable: true })
  tagPosts: typeof TagPostsUnion[];

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
