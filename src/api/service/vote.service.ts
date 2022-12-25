import { Vote } from './../entities/vote';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from '../entities/answer';
import { Question } from '../entities/question';
import { UserService } from './user.service';
import { VotePostInput } from 'src/model';
import { CurrentUser } from 'src/decorators/user.decorator';
import { PostType } from 'src/helpers/constant';
import { Comment } from '../entities/comment';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    @InjectRepository(Vote) private voteRepo: Repository<Vote>,
    @InjectRepository(Answer) private answerRepo: Repository<Answer>,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    private userService: UserService,
  ) {}

  async votePost(input: VotePostInput, @CurrentUser() user): Promise<Vote> {
    const vote = new Vote();

    const isVoteExist = await this.voteRepo.findOne({
      where: {
        creator_id: user?.userId,
        ...this.getPostKey(input),
      },
    });
    if (isVoteExist)
      throw new HttpException('you already voted!', HttpStatus.BAD_REQUEST);

    const userDetail = await this.userService.getUser(user?.userId);

    vote.creator = userDetail;
    vote.creator_id = user?.userId;
    vote.voteType = input?.voteType;
    vote.postType = input?.postType;

    if (input?.postType === PostType.QUESTION) {
      const question = await this.questionRepo.findOne({
        where: { id: input?.questionId },
      });
      if (!question)
        throw new HttpException('Question not found!', HttpStatus.NOT_FOUND);
      vote.question_Id = input?.questionId;
      vote.question = question;
    } else if (input?.postType === PostType.ANSWER) {
      const answer = await this.answerRepo.findOne({
        where: { id: input?.answerId },
      });
      if (!answer)
        throw new HttpException('Answer not found!', HttpStatus.NOT_FOUND);

      vote.answer_Id = input?.answerId;
      vote.answer = answer;
    } else if (input?.postType === PostType.COMMENT) {
      const comment = await this.commentRepo.findOne({
        where: { id: input?.commentId },
      });
      if (!comment)
        throw new HttpException('Comment not found!', HttpStatus.NOT_FOUND);

      vote.comment_Id = input?.commentId;
      vote.comment = comment;
    } else {
      throw new HttpException('Invalid Post!', HttpStatus.BAD_REQUEST);
    }

    return await this.voteRepo.save(vote);
  }

  public getPostKey(input: VotePostInput) {
    const { questionId, answerId, commentId, postType } = input;
    if (postType === PostType.ANSWER) {
      return { answer_Id: answerId };
    } else if (postType === PostType.COMMENT) {
      return { comment_Id: commentId };
    } else if (postType === PostType.QUESTION) {
      return { question_Id: questionId };
    } else {
      return null;
    }
  }
}
