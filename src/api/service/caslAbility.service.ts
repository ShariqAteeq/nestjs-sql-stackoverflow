import { UserService } from 'src/api/service/user.service';
import { VoteService } from './vote.service';
import { Vote } from './../entities/vote';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '../entities/user';
import { InferSubjects } from '@casl/ability';
import { Action } from 'src/helpers/constant';
import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';

type Subjects = InferSubjects<typeof Vote | typeof User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  constructor(private userService: UserService) {}

  async createForUser(user) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    const repCount = await this.userService.getReputationCount(user?.userId);
    console.log('repCount', repCount);

    if (repCount == 0) {
      can(Action.Vote, 'all');
    } else {
      throw new HttpException(
        'You need atleast 10 Reputation',
        HttpStatus.UNAUTHORIZED,
      );
    }

    console.log('user in abilit', user);

    // if (user.isAdmin) {
    //   can(Action.Manage, 'all'); // read-write access to everything
    // } else {
    //   can(Action.Read, 'all'); // read-only access to everything
    // }

    // cannot(Action.Vote, User, { reputationsCount: { $lte: 50 } });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
