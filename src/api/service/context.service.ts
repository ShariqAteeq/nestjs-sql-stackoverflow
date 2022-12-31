import { Injectable } from '@nestjs/common';
// import { User } from '../entities/user';

@Injectable()
export class UserContextService {
  userId: string;
}
