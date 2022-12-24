import { UserService } from 'src/api/service/user.service';
import { CurrentUser } from './../../decorators/user.decorator';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddTagInput } from 'src/model';
import { Repository } from 'typeorm';
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
}
