import { CurrentUser } from 'src/decorators/user.decorator';
import { UserService } from 'src/api/service/user.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from '../entities/answer';
import { Question } from '../entities/question';
import { PostAnswerInput } from 'src/model';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer) private answerRepo: Repository<Answer>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    private userService: UserService,
  ) {}

  async postAnswer(
    input: PostAnswerInput,
    @CurrentUser() user,
  ): Promise<Answer> {
    const answer = new Answer();

    const { userId } = user;
    const userDetail = await this.userService.getUser(userId);

    const question = await this.questionRepo.findOne({
      where: { id: input?.questionId },
    });
    if (!question)
      throw new HttpException('Question not found!', HttpStatus.NOT_FOUND);

    answer.desc = input?.desc;
    answer.question = question;
    answer.creator_id = userId;
    answer.creator = userDetail;

    // Updating Question Modified time;
    question.lastModifiedAt = new Date();
    question.lastModifiedby = userDetail;
    await this.questionRepo.save(question);

    return await this.answerRepo.save(answer);
  }
}
