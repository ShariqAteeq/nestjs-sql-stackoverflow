import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from './tag';
import { User } from './user';

@ObjectType()
@Entity('question')
export class Question {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: number;

  @Column()
  @Field({ nullable: true })
  title: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  desc: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  canIAnswer: Boolean;

  @Column()
  @Field({ nullable: true })
  creator_id: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  viewCount: number;

  @ManyToOne(() => User, (u) => u.id, { nullable: true })
  @Field({ nullable: true })
  creator: User;

  @OneToMany(() => Tag, (t) => t.question)
  @Field(() => [Tag], { nullable: true })
  tags: Tag[];

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