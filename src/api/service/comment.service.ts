import { AddCommentInput } from './../../model';
import { CurrentUser } from 'src/decorators/user.decorator';
import { UserService } from 'src/api/service/user.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from '../entities/answer';
import { Question } from '../entities/question';
import { Comment } from '../entities/comment';
import { PostType } from 'src/helpers/constant';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    @InjectRepository(Answer) private answerRepo: Repository<Answer>,
    private userService: UserService,
  ) {}

  async addComment(
    input: AddCommentInput,
    @CurrentUser() user,
  ): Promise<Comment> {
    const userDetails = await this.userService.getUser(user?.userId);

    const comment = new Comment();
    comment.text = input?.text;
    comment.postType = input?.postType;
    comment.creator_id = user?.userId;
    comment.creator = userDetails;

    if (input?.postType === PostType.QUESTION) {
      const question = await this.questionRepo.findOne({
        where: { id: input?.questionId },
      });
      if (!question)
        throw new HttpException('Question not found!', HttpStatus.NOT_FOUND);
      comment.question_Id = input?.questionId;
      comment.question = question;
    } else if (input?.postType === PostType.ANSWER) {
      const answer = await this.answerRepo.findOne({
        where: { id: input?.answerId },
      });
      if (!answer)
        throw new HttpException('Answer not found!', HttpStatus.NOT_FOUND);

      comment.answer_Id = input?.answerId;
      comment.answer = answer;
    } else {
      throw new HttpException('Invalid Post!', HttpStatus.BAD_REQUEST);
    }

    return await this.commentRepo.save(comment);
  }
}
