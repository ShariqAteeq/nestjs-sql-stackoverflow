import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Vote } from '../entities/vote';

@EventSubscriber()
export class VoteSubscriber implements EntitySubscriberInterface<Vote> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Vote;
  }

  async afterInsert(event: InsertEvent<Vote>) {}
}
