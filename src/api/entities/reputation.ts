import { REPUTATION_TYPES } from './../../helpers/reputationConstant';
import { PostType } from 'src/helpers/constant';
import { PostUnion } from './../../model';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user';

@ObjectType()
@Entity('reputation')
export class Reputation {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field({ nullable: true })
  id: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  user_id: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  postId: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  reputationValue: number;

  @Column({ nullable: true })
  @Field(() => PostType, { nullable: true })
  postType: PostType;

  @Column({ nullable: true })
  @Field(() => REPUTATION_TYPES, { nullable: true })
  reputationType: REPUTATION_TYPES;

  @Field(() => PostUnion, { nullable: true })
  post: typeof PostUnion;

  @ManyToOne(() => User, { nullable: true })
  @Field(() => User, { nullable: true })
  user: User;

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
