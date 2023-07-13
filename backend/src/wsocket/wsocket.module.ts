import { Module } from '@nestjs/common';

import { WsocketGateway } from './wsocket.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [WsocketGateway],
  exports: [WsocketGateway],
})
export class WsocketModule {}
