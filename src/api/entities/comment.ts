import { Answer } from './answer';
import { Question } from './question';
import { PostType } from './../../helpers/constant';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user';
import { Vote } from './vote';

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

  @OneToMany(() => Vote, (c) => c.comment, { nullable: true })
  @Field(() => [Vote], { nullable: true })
  votes: Vote[];

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
