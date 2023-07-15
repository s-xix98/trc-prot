import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';

import { WsocketGateway } from './wsocket.gateway';

@Module({
  imports: [AuthModule],
  providers: [WsocketGateway],
  exports: [WsocketGateway],
})
export class WsocketModule {}
