import { Vote } from './vote';
import { Answer } from './answer';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from './tag';
import { User } from './user';
import { Comment } from './comment';

@ObjectType()
@Entity('question')
export class Question {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: number;

  @Column()
  @Field({ nullable: true })
  title: string;

  @Column({ nullable: true, length: 10000 })
  @Field({ nullable: true })
  desc: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  canIAnswer: Boolean;

  @Column()
  @Field({ nullable: true })
  creator_id: string;

  @Column({ nullable: true, default: 0 })
  @Field({ nullable: true })
  viewCount: number;

  @Field({ nullable: true })
  answersCount: number;

  @Field({ nullable: true })
  votesCount: number;

  @ManyToOne(() => User, (u) => u.id, { nullable: true })
  @Field({ nullable: true })
  creator: User;

  @Column('simple-array', { nullable: true })
  @Field(() => [Number], { nullable: true })
  tags_ids: number[];

  @OneToOne(() => Answer, (ans) => ans.id, { nullable: true })
  @JoinColumn()
  @Field(() => Answer, { nullable: true })
  bestAnswer: Answer;

  @Column({ nullable: true })
  @Field({ nullable: true })
  bestAnswerSelectedAt: Date;

  // @Field(() => [Tag], { nullable: true })
  // tags: Tag[];

  @ManyToMany(() => Tag, (t) => t.questions, { nullable: true })
  @JoinTable({ name: 'question_tags' })
  @Field(() => [Tag], { nullable: true })
  tags: Tag[];

  @OneToMany(() => Answer, (a) => a.question, { nullable: true })
  @Field(() => [Answer], { nullable: true })
  answers: Answer[];

  @OneToMany(() => Comment, (c) => c.question, { nullable: true })
  @Field(() => [Comment], { nullable: true })
  comments: Comment[];

  @OneToMany(() => Vote, (c) => c.question, { nullable: true })
  @Field(() => [Vote], { nullable: true })
  votes: Vote[];

  @Column({ nullable: true })
  @Field({ nullable: true })
  lastModifiedAt: Date;

  @ManyToOne(() => User, (u) => u.id, { nullable: true })
  @Field({ nullable: true })
  lastModifiedby: User;

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
