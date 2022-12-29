import { Answer } from './../entities/answer';
import { User } from 'src/api/entities/user';
import { Question } from './../entities/question';
import { TagFilter } from './../../helpers/constant';
import { CurrentUser } from './../../decorators/user.decorator';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddTagInput, ListTagsFilter, TagPostsUnion } from 'src/model';
import { Repository, In } from 'typeorm';
import { Tag } from '../entities/tag';
import _ = require('lodash');
import * as moment from 'moment';
import { Pagination } from 'src/paginate/pagination';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private tagRepo: Repository<Tag>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    @InjectRepository(Answer) private answerRepo: Repository<Answer>,
    @InjectRepository(User) private userRepo: Repository<User>,
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
    const userDetail = await this.userRepo.findOneBy({ id: user?.userId });

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

  async getTag(id: number): Promise<Tag> {
    return await this.tagRepo.findOneOrFail({ where: { id } });
  }

  async listTagQuestions(
    id: number,
    limit: number = 10000,
    offset: number = 0,
  ): Promise<Pagination<Question>> {
    const [results, total] = await this.questionRepo.findAndCount({
      take: limit,
      skip: offset,
      relations: [
        'creator',
        'lastModifiedby',
        'bestAnswer',
        'votes',
        'answers',
      ],
      where: {
        tags: {
          id,
        },
      },
    });

    return new Pagination<Question>({
      results,
      total,
      limit,
      offset,
    });
  }

  async getTagById(id: number): Promise<Tag> {
    return await this.tagRepo.findOne({ where: { id } });
  }

  async watchTag(id: number, @CurrentUser() user): Promise<User> {
    const tag = await this.getTagById(id);
    const userDetail = await this.userRepo.findOne({
      where: { id: user?.userId },
      relations: ['ignoredTags', 'watchedTags'],
    });
    if (userDetail?.watchedTags?.find((t) => +t.id === id)) return userDetail;
    if (userDetail?.ignoredTags.find((t) => +t.id === id)) {
      userDetail.ignoredTags = userDetail.ignoredTags.filter(
        (t) => +t.id !== id,
      );
      userDetail.ignoredTagsIds = userDetail?.ignoredTagsIds.filter(
        (x) => +x !== id,
      );
    }
    userDetail.watchedTags =
      userDetail?.watchedTags?.length > 0
        ? [...userDetail?.watchedTags, tag]
        : [tag];
    userDetail.watchedTagsIds =
      userDetail?.watchedTagsIds?.length > 0
        ? [...userDetail?.watchedTagsIds, id]
        : [id];

    await this.userRepo.save(userDetail);
    return userDetail;
  }

  async ignoreTag(id: number, @CurrentUser() user): Promise<User> {
    const tag = await this.getTagById(id);
    const userDetail = await this.userRepo.findOne({
      where: { id: user?.userId },
      relations: ['watchedTags', 'ignoredTags'],
    });
    if (userDetail?.ignoredTags?.find((t) => +t.id === id)) return userDetail;
    if (userDetail?.watchedTags?.find((t) => +t.id === id)) {
      userDetail.watchedTags = userDetail.watchedTags.filter(
        (t) => +t.id !== id,
      );
      console.log('userDetail', userDetail.watchedTags);
      console.log('userDetail', userDetail.watchedTagsIds);
      userDetail.watchedTagsIds = userDetail?.watchedTagsIds.filter(
        (x) => +x !== id,
      );
    }

    userDetail.ignoredTags =
      userDetail?.ignoredTags?.length > 0
        ? [...userDetail?.ignoredTags, tag]
        : [tag];
    userDetail.ignoredTagsIds =
      userDetail?.ignoredTagsIds?.length > 0 &&
      !userDetail?.ignoredTagsIds?.find((x) => +x === id)
        ? [...userDetail?.ignoredTagsIds, id]
        : [id];
    await this.userRepo.save(userDetail);
    return userDetail;
  }

  async userPostCountOnTag(id: number, @CurrentUser() user): Promise<number> {
    const res = await this.tagRepo.findOne({
      where: { id, questions: { creator_id: user?.userId } },
      relations: ['questions', 'questions.answers'],
    });

    let count = res?.questions?.length ?? 0;
    res?.questions?.forEach((x) => (count += x.answers.length));

    return count;
  }

  async getTagPosts(
    id: number,
    @CurrentUser() user,
  ): Promise<Array<typeof TagPostsUnion>> {
    const res = await this.tagRepo.findOne({
      where: { id, questions: { creator_id: user?.userId } },
      relations: ['questions', 'questions.answers'],
    });

    const result = [];
    res?.questions?.forEach((x) => {
      if (x?.answers?.length > 0) {
        x.answers.forEach((y) => {
          result.push({
            __typename: 'Answer',
            ...y,
          });
        });
      }
      result.push({
        __typename: 'Question',
        ...x,
      });
    });
    const sortedByNewest = _.orderBy(result, ['logCreatedAt'], ['desc']);
    return sortedByNewest;
  }
}
