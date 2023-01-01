import { Answer } from './answer';
import { Question } from './question';
import { UserRole, UserStatus } from 'src/helpers/constant';
import { Field, HideField, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from './tag';

@ObjectType()
@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ unique: true, nullable: true })
  @Field({ nullable: true })
  email: string;

  @Column({ nullable: true })
  @Field(() => UserRole, { nullable: true })
  role: UserRole;

  @Column({ nullable: true })
  @Field({ nullable: true })
  profileImg: string;

  @OneToMany(() => Question, (q) => q.creator, { nullable: true })
  @Field(() => [Question], { nullable: true })
  questions: Question[];

  @OneToMany(() => Answer, (q) => q.creator, { nullable: true })
  @Field(() => [Answer], { nullable: true })
  answers: Answer[];

  @Column('simple-array', { nullable: true })
  @Field(() => [Number], { nullable: true })
  watchedTagsIds: number[];

  @ManyToMany(() => Tag, (t) => t.users, { nullable: true })
  @JoinTable({ name: 'user_watched_tags' })
  @Field(() => [Tag], { nullable: true })
  watchedTags: Tag[];

  @Column('simple-array', { nullable: true })
  @Field(() => [Number], { nullable: true })
  ignoredTagsIds: number[];

  @ManyToMany(() => Tag, (t) => t.users, { nullable: true })
  @JoinTable({ name: 'user_ignored_tags' })
  @Field(() => [Tag], { nullable: true })
  ignoredTags: Tag[];

  @Column({ nullable: true })
  @Field({ nullable: true })
  coverImg: string;

  @Field({ nullable: true, defaultValue: 1 })
  reputationsCount: number;

  @Column({ unique: true, nullable: true })
  @Field({ nullable: true })
  name: string;

  @Column({ nullable: true })
  @Field(() => UserStatus, { nullable: true })
  status: UserStatus;

  @Column({ nullable: true })
  @HideField()
  password?: string;

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
