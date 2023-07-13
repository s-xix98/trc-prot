import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { io, Socket } from 'socket.io-client';

import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';

import { testUser } from './types/test.types';

@Injectable()
export class TestService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}

  async createTestUsersWithSockets(n: number): Promise<testUser[]> {
    const testUsers: testUser[] = [];
    for (let i = 0; i < n; i++) {
      const user: User = await this.prismaService.user.upsert({
        where: {
          email: `TestUser${i}@test.com`,
        },
        update: {},
        create: {
          email: `TestUser${i}@test.com`,
          username: `TestUser${i}`,
          hashedPassword: `TestUser${i}`,
        },
      });

      const token = await this.authService.generateJwt(user.id, user.username);
      const socket: Socket = io('http://localhost:8001', { auth: { token } });
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
    emitEventName: string,
    onEventName: string,
    socket: Socket,
    dto: T,
  ): Promise<unknown> {
    return new Promise((resolve) => {
      socket.on(onEventName, async () => resolve(null));
      socket.emit(emitEventName, dto);
    });
  }

  async sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }
}
