import { UserContextService } from 'src/api/service/context.service';
import { Global, Module } from '@nestjs/common';
Global();
Module({
  providers: [UserContextService],
  exports: [UserContextService],
});
export class ContextModule {}
