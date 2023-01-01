import { UserContextService } from './../service/context.service';
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

@EventSubscriber()
export class VoteSubscriber implements EntitySubscriberInterface<Vote> {
  constructor(dataSource: DataSource, private userService: UserContextService) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Vote;
  }

  // async beforeInsert(event: InsertEvent<Vote>){
  // }

  getReputationTypeAndValue(
    postType: PostType,
    voteType: VoteType,
    userId?: string,
  ) {
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
        reputationType: this.amICreator(userId, this.userService.userId)
          ? REPUTATION_TYPES.YOU_VOTE_DOWN_ANSWER
          : REPUTATION_TYPES.ANSWER_VOTE_DOWN,
        reputationValue: this.amICreator(userId, this.userService.userId)
          ? REPUTATION_VALUES.YOU_VOTE_DOWN_ANSWER
          : REPUTATION_VALUES.ANSWER_VOTE_DOWN,
      };
    }
  }

  amICreator(creator: string, currentUser: string) {
    return creator === currentUser ? true : false;
  }

  async addReputationInDB(
    payload: Vote,
    userId: string,
    event: InsertEvent<Vote>,
  ) {
    const { manager } = event;
    const user = await manager.getRepository(User).findOneBy({ id: userId });

    const reputation = new Reputation();
    if (payload.question_Id) reputation.postId = payload.question_Id;
    if (payload.answer_Id) reputation.postId = payload.answer_Id;
    if (payload.comment_Id) reputation.postId = payload.comment_Id;
    reputation.postType = payload.postType;
    reputation.user = user;
    reputation.user_id = user.id;
    const { reputationType, reputationValue } = this.getReputationTypeAndValue(
      payload.postType,
      payload.voteType,
      userId,
    );
    reputation.reputationType = reputationType;
    reputation.reputationValue = reputationValue;

    await manager.getRepository(Reputation).save(reputation);
  }

  async afterInsert(event: InsertEvent<Vote>) {
    const { entity } = event;
    console.log('entity', entity);
    console.log('user', this.userService.userId);

    await this.addReputationInDB(entity, entity?.creator_id, event);
    if (
      this.amICreator(entity?.creator_id, this.userService.userId) &&
      entity.postType === PostType.ANSWER &&
      entity.voteType === VoteType.DOWNVOTE
    ) {
      await this.addReputationInDB(entity, this.userService.userId, event);
    }
  }
}
