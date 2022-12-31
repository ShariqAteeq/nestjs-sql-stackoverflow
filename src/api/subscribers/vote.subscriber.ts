import {
  REPUTATION_TYPES,
  REPUTATION_VALUES,
} from './../../helpers/reputationConstant';
import { VoteType } from './../../helpers/constant';
import { PostType } from 'src/helpers/constant';
import { Reputation } from './../entities/reputation';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Vote } from '../entities/vote';
import { User } from '../entities/user';
import { CurrentUser } from 'src/decorators/user.decorator';

@EventSubscriber()
export class VoteSubscriber implements EntitySubscriberInterface<Vote> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Vote;
  }

  getReputationTypeAndValue(postType: PostType, voteType: VoteType) {
    if (postType === PostType.QUESTION && voteType === VoteType.UPVOTE) {
      return {
        reputationType: REPUTATION_TYPES.QUESTION_VOTED_UP,
        reputationValue: REPUTATION_VALUES.QUESTION_VOTED_UP,
      };
    }
    if (postType === PostType.ANSWER && voteType === VoteType.UPVOTE) {
      return {
        reputationType: REPUTATION_TYPES.ANSWER_VOTED_UP,
        reputationValue: REPUTATION_VALUES.ANSWER_VOTED_UP,
      };
    }
    if (postType === PostType.QUESTION && voteType === VoteType.DOWNVOTE) {
      return {
        reputationType: REPUTATION_TYPES.QUESTION_VOTE_DOWN,
        reputationValue: REPUTATION_VALUES.QUESTION_VOTE_DOWN,
      };
    }
    if (postType === PostType.ANSWER && voteType === VoteType.DOWNVOTE) {
      return {
        reputationType: REPUTATION_TYPES.ANSWER_VOTE_DOWN,
        reputationValue: REPUTATION_VALUES.ANSWER_VOTE_DOWN,
      };
    }
  }

  async afterInsert(event: InsertEvent<Vote>) {
    const { entity, manager } = event;
    console.log('entity', entity);

    const user = await manager
      .getRepository(User)
      .findOneBy({ id: entity.creator_id });

    const reputation = new Reputation();
    if (entity.question_Id) reputation.postId = entity.question_Id;
    if (entity.answer_Id) reputation.postId = entity.answer_Id;
    if (entity.comment_Id) reputation.postId = entity.comment_Id;
    reputation.postType = entity.postType;
    reputation.user = user;
    reputation.user_id = user.id;
    const { reputationType, reputationValue } = this.getReputationTypeAndValue(
      entity.postType,
      entity.voteType,
    );
    reputation.reputationType = reputationType;
    reputation.reputationValue = reputationValue;

    await manager.getRepository(Reputation).save(reputation);
  }
}
