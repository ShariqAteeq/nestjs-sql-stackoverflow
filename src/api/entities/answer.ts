import { Question } from './question';
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
import { Comment } from './comment';
import { Vote } from './vote';

@ObjectType()
@Entity('answer')
export class Answer {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: number;

  @Column()
  @Field({ nullable: true })
  desc: string;

  @ManyToOne(() => Question, (q) => q.id, { nullable: true })
  @Field(() => Question, { nullable: true })
  question: Question;

  @Column({ nullable: true })
  @Field({ nullable: true })
  question_id: number;

  @OneToMany(() => Comment, (c) => c.answer, { nullable: true })
  @Field(() => [Comment], { nullable: true })
  comments: Comment[];

  @OneToMany(() => Vote, (c) => c.answer, { nullable: true })
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
