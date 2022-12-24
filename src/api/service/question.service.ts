import { Tag } from './../entities/tag';
import { CurrentUser } from 'src/decorators/user.decorator';
import { UserService } from 'src/api/service/user.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../entities/question';
import { AskQuestionInput } from 'src/model';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    // @InjectRepository(Tag) private tagRepo: Repository<Tag>,
    private userService: UserService,
  ) {}

  async askQuestion(
    input: AskQuestionInput,
    @CurrentUser() user,
  ): Promise<Question> {
    const question = new Question();

    const userDetail = await this.userService.getUser(user?.userId);
    console.log('AskQuestionInput', input);
    // const tags = await this.tagRepo.find({ where: { id: In(input?.tags) } });
    // console.log('tags', tags);

    question.canIAnswer = input?.canIAnswer;
    question.desc = input?.desc;
    question.title = input?.title;
    question.tags_ids = input?.tags;
    question.creator_id = user?.userId;
    question.creator = userDetail;

    return await this.questionRepo.save(question);
  }

  async viewQuestion(id: number) {
    await this.questionRepo.increment({ id }, 'viewCount', 1);
    return true;
  }

  async getQuestion(id: number): Promise<Question> {
    return await this.questionRepo.findOne({ where: { id } });
  }
}
