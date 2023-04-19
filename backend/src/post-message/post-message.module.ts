import { Module } from '@nestjs/common';
import { PostMessageController } from './post-message.controller';
import { PostMessageService } from './post-message.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PostMessageController],
  providers: [PostMessageService],
})
export class PostMessageModule {}
