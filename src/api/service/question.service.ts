import { Pagination } from './../../paginate/pagination';
import { CurrentUser } from 'src/decorators/user.decorator';
import { UserService } from 'src/api/service/user.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Question } from '../entities/question';
import { AskQuestionInput, ListQuestionFilter } from 'src/model';
import { Answer } from '../entities/answer';
import { Tag } from '../entities/tag';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    @InjectRepository(Answer) private answerRepo: Repository<Answer>,
    @InjectRepository(Tag) private tagRepo: Repository<Tag>,
    private userService: UserService,
  ) {}

  async askQuestion(
    input: AskQuestionInput,
    @CurrentUser() user,
  ): Promise<Question> {
    const question = new Question();

    const userDetail = await this.userService.getUser(user?.userId);
    const tags = await this.tagRepo.find({ where: { id: In(input?.tags) } });

    question.canIAnswer = input?.canIAnswer;
    question.desc = input?.desc;
    question.title = input?.title;
    question.tags_ids = input?.tags;
    question.tags = tags;
    question.creator_id = user?.userId;
    question.creator = userDetail;

    return await this.questionRepo.save(question);
  }

  async viewQuestion(id: number) {
    await this.questionRepo.increment({ id }, 'viewCount', 1);
    return true;
  }

  async getQuestion(id: number): Promise<Question> {
    const question = await this.questionRepo.findOne({
      where: { id },
      relations: [
        'answers',
        'creator',
        'answers.creator',
        'lastModifiedby',
        'bestAnswer',
        'votes',
        'comments',
        'comments.votes',
        'comments.creator',
        'answers.comments',
        'answers.comments.votes',
        'answers.votes',
        'answers.comments.creator',
      ],
    });
    if (!question)
      throw new HttpException('Question not found!', HttpStatus.NOT_FOUND);
    return question;
  }

  async selectBestAnswer(
    answerId: number,
    questionId: number,
    @CurrentUser() user,
  ): Promise<Question> {
    const answer = await this.answerRepo.findOne({
      where: { id: answerId },
    });
    if (!answer)
      throw new HttpException('Answer not found!', HttpStatus.NOT_FOUND);

    const question = await this.questionRepo.findOne({
      where: { id: questionId },
    });

    if (question.creator_id !== user?.userId)
      throw new HttpException(
        'Only owner can select a best answer!',
        HttpStatus.BAD_REQUEST,
      );

    question.bestAnswer = answer;
    question.bestAnswerSelectedAt = new Date();
    return await this.questionRepo.save(question);
  }

  async listQuestions(
    limit: number = 5,
    offset: number = 0,
    filter: ListQuestionFilter,
  ): Promise<Pagination<Question>> {
    const [results, total] = await this.questionRepo.findAndCount({
      take: limit,
      skip: offset,
      relations: ['creator', 'lastModifiedby', 'bestAnswer', 'votes'],
    });

    return new Pagination<Question>({
      results,
      total,
      limit,
      offset,
    });
  }

  async getQuestionAnswers(id): Promise<number> {
    return await this.answerRepo.count({ where: { question_id: id } });
  }
}
