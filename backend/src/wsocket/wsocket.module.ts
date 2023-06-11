import { Module } from '@nestjs/common';
import { WsocketGateway } from './wsocket.gateway';

@Module({
  providers: [WsocketGateway],
})
export class WsocketModule {}
