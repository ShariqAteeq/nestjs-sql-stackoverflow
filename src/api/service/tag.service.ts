import { Question } from './../entities/question';
import { TagFilter } from './../../helpers/constant';
import { UserService } from 'src/api/service/user.service';
import { CurrentUser } from './../../decorators/user.decorator';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddTagInput, ListTagsFilter } from 'src/model';
import { Repository } from 'typeorm';
import { Tag } from '../entities/tag';
import _ = require('lodash');
import * as moment from 'moment';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private tagRepo: Repository<Tag>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    private userService: UserService,
  ) {}

  async addTag(input: AddTagInput, @CurrentUser() user): Promise<Tag> {
    const isTagExist = await this.tagRepo.findOne({
      where: { name: input?.name },
    });
    if (isTagExist)
      throw new HttpException(
        'Tag already exist with this name',
        HttpStatus.BAD_REQUEST,
      );

    const tag = new Tag();
    const userDetail = await this.userService.getUser(user?.userId);

    tag.name = input?.name;
    tag.desc = input?.desc;
    tag.creator_id = user?.userId;
    tag.creator = userDetail;

    return await this.tagRepo.save(tag);
  }

  async listTags(filter: ListTagsFilter): Promise<Tag[]> {
    let tagQuery = this.tagRepo
      .createQueryBuilder('tag')
      .leftJoinAndSelect('tag.questions', 'question')
      .loadRelationCountAndMap('tag.questionCount', 'tag.questions');

    if (filter?.query) {
      tagQuery = tagQuery.where('tag.name like :name', {
        name: `${filter?.query}%`,
      });
    }

    if (filter?.filterBy === TagFilter.NAME) {
      tagQuery = tagQuery.orderBy('tag.name', 'ASC');
    }

    let results = await tagQuery.getMany();
    if (filter?.filterBy === TagFilter.POPULAR) {
      results = _.orderBy(results, ['questionCount'], ['desc']);
    }

    return results;
  }

  async askedTodayQuestionCount(id: number): Promise<number> {
    const res = await this.questionRepo
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.tags', 'tag')
      .where('tag.id = :id', { id })
      .andWhere('question.logCreatedAt >=  CURDATE()')
      .getCount();

    console.log('momet', moment().startOf('isoWeek'));

    return res;
  }

  async thisWeekQuestionCount(id: number): Promise<number> {
    const res = await this.questionRepo
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.tags', 'tag')
      .where('tag.id = :id', { id })
      .andWhere('question.logCreatedAt >=  :weekDate', {
        weekDate: moment().startOf('isoWeek').format('YYYY-MM-DD'),
      })
      .getCount();
    return res;
  }

  async totalQuestionCount(id: number): Promise<number> {
    const res = await this.questionRepo
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.tags', 'tag')
      .where('tag.id = :id', { id })
      .getCount();
    return res;
  }
}
