import { Module } from '@nestjs/common';
import { PostMessageController } from './post-message.controller';
import { PostMessageService } from './post-message.service';

@Module({
  controllers: [PostMessageController],
  providers: [PostMessageService],
})
export class PostMessageModule {}
