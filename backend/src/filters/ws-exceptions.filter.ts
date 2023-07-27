import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

import { CustomException } from '../exceptions/custom.exception';

@Catch()
export class WsExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);

    console.log('error', exception);

    const client = host.switchToWs().getClient();

    if (exception instanceof CustomException) {
      client.emit('error', exception.message);
      return;
    }
    client.emit('error', 'error');
  }
}
