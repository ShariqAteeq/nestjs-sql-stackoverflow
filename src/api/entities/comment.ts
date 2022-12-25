import { ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
}
