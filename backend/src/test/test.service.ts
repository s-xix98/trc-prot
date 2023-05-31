import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { io, Socket } from 'socket.io-client';

import { PrismaService } from '../prisma/prisma.service';

import { testUser } from './types/test.types';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async createTestUsersWithSockets(n: number): Promise<testUser[]> {
    const testUsers: testUser[] = [];
    for (let i = 0; i < n; i++) {
      const socket: Socket = io('http://localhost:8001');

      const user: User = await this.prismaService.user.upsert({
        where: {
          email: `chatTestUser${i}@test.com`,
        },
        update: {},
        create: {
          email: `chatTestUser${i}@test.com`,
          username: `chatTestUser${i}`,
          hashedPassword: `chatTestUser${i}`,
        },
      });

      testUsers.push({ user, socket });
    }
    return testUsers;
  }

  async cleanupDatabase(modelNames: string[]): Promise<void> {
    console.log(modelNames);
    // prisma.user prisma.chatroom 的なのになる
    for (const name of modelNames) {
      await (this.prismaService as any)[name].deleteMany({});
    }
  }

  async emitAndWaitForEvent<T>(
    eventName: string,
    socket: Socket,
    dto: T,
  ): Promise<unknown> {
    return new Promise((resolve) => {
      socket.on(eventName, async () => resolve(null));
      socket.emit(eventName, dto);
    });
  }
}
