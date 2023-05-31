import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { testUser } from './types/test.types';
import { User } from '@prisma/client';
import { io ,Socket } from 'socket.io-client';

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

