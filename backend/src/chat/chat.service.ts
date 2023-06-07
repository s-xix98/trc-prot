import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  getAllChannels() {
    return [
      { id: 1, name: 'mock room 1' },
      { id: 2, name: 'mock room 2' },
    ];
  }
}
