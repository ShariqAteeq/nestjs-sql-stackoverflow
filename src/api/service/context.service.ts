import { Injectable } from '@nestjs/common';
import { Scope } from '@nestjs/common/interfaces/scope-options.interface';
@Injectable({ scope: Scope.DEFAULT })
export class UserContextService {
  userId: string;
}
