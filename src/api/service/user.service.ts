import { Reputation } from './../entities/reputation';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user';
import * as bcrypt from 'bcrypt';
import { Token } from '../entities/token';
import * as moment from 'moment';
import { UserStatus } from 'src/helpers/constant';
import { UserSignUpInput } from 'src/model';
import { CurrentUser } from 'src/decorators/user.decorator';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Token) private TokenRepo: Repository<Token>,
    @InjectRepository(Reputation) private repRepo: Repository<Reputation>,
  ) {}

  async create(payload: UserSignUpInput): Promise<User> {
    const { email, password, name, role } = payload;

    const existingUser = await this.userRepo.findOne({ where: { email } });

    if (existingUser) {
      throw new HttpException(
        'User with this email already exist.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = new User();
    user['password'] = await bcrypt.hash(password, 10);
    user['email'] = email;
    user['name'] = name;
    user['status'] = UserStatus.ACTIVE;
    user['role'] = role;
    const createdUser = await this.userRepo.save(user);
    return createdUser;
  }

  async getUser(id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
    });
    return user;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['questions', 'answers', 'ignoredTags', 'watchedTags'],
    });
    if (!user) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepo.find();
  }

  async storeToken(userId: string, refreshToken: string): Promise<Token> {
    const token = this.TokenRepo.create({
      userId,
      refreshToken,
      expiresAt: moment().add(5, 'days').toDate(),
    });
    return await this.TokenRepo.save(token);
  }

  async getLoggedInUSer(@CurrentUser() user) {
    return user;
  }

  async getReputationCount(id: string): Promise<number> {
    const rep = await this.repRepo
      .createQueryBuilder('rep')
      .where('rep.user_id = :user_id', { user_id: id })
      .select('SUM(rep.reputationValue)', 'totalRepCount')
      .getRawOne();
    console.log('id in getReputationCount', id);
    return +rep.totalRepCount;
  }
}
