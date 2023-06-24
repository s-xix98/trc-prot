import { Module } from '@nestjs/common';

import { WsocketGateway } from './wsocket.gateway';

@Module({
  providers: [WsocketGateway],
  exports: [WsocketGateway],
})
export class WsocketModule {}
