import { UserStatus } from 'src/helpers/constant';
import { Field, HideField, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity('User')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ unique: true, nullable: true })
  @Field({ nullable: true })
  email: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  profileImg: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  coverImg: string;

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
