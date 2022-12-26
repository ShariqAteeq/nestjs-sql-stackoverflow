import { Question } from './../entities/question';
import { TagFilter } from './../../helpers/constant';
import { UserService } from 'src/api/service/user.service';
import { CurrentUser } from './../../decorators/user.decorator';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddTagInput, ListTagsFilter } from 'src/model';
import { Like, Repository } from 'typeorm';
import { Tag } from '../entities/tag';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private tagRepo: Repository<Tag>,
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
    const tags = await this.tagRepo
      .createQueryBuilder('tag')
      .leftJoinAndSelect('tag.questions', 'question')
      .groupBy('question.id') // here is where we grup by the tag so we can count
      .addGroupBy('question.id')
      .select('question.id, count(question.id)') // here is where we count :)
      .orderBy('"count"', 'DESC')
      .getMany();
    console.log('tags', tags);
    // return await this.tagRepo.find({
    //   relations: ['questions'],
    //   where: { name: filter?.query ? Like(`${filter?.query}%`) : undefined },

    //   order: {
    //     questions: { id:  },
    //     name: filter?.filterBy === TagFilter.NAME ? 'ASC' : undefined,
    //   },
    // });
    return tags;
  }
}
