import { PostUnion } from './../../model';
import { Reputation } from './../entities/reputation';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUser } from 'src/decorators/user.decorator';
import { PostType } from 'src/helpers/constant';
import { Question } from '../entities/question';

@Injectable()
export class ReputationService {
  constructor(
    @InjectRepository(Reputation)
    private reputationRepo: Repository<Reputation>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
  ) {}

  async listReputations(@CurrentUser() user): Promise<Reputation[]> {
    return await this.reputationRepo.find({ where: { user_id: user?.userId } });
  }

  async getPostAccToType(rep: Reputation): Promise<typeof PostUnion> {
    const { postType, postId } = rep;
    if (postType === PostType.QUESTION) {
      const ques = await this.questionRepo.findOneBy({ id: postId });
      return {
        ...ques,
        // __typename: 'Question',
      };
    }
  }
}
