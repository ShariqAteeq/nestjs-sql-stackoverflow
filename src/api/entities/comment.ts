import { PostType } from './../../helpers/constant';
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
@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: number;

  @Column()
  @Field({ nullable: true })
  text: string;

  @Column()
  @Field(() => PostType, { nullable: true })
  postType: PostType;

  @Column({ nullable: true })
  @Field({ nullable: true })
  questionId: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  answerId: number;

  @Column()
  @Field({ nullable: true })
  creator_id: string;

  @ManyToOne(() => User, (u) => u.id, { nullable: true })
  @Field({ nullable: true })
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
