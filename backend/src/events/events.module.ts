import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [PrismaModule],
  providers: [EventsGateway],
})
export class EventsModule {}
