import { Test, TestingModule } from '@nestjs/testing';
import { PostMessageService } from './post-message.service';
import { PrismaService } from '../prisma/prisma.service';

type Message = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  authorId: number;
};
const mockMsg: Message = {
  id: 12,
  createdAt: new Date(),
  updatedAt: new Date(),
  content: 'nori',
  authorId: 1,
};

const mockPrismaService = {
  message: {
    // PrismaService.createをmockMsgを返すだけの関数にした
    create: jest.fn().mockReturnValue(mockMsg),
  },
};

describe('PostMessageService', () => {
  let service: PostMessageService;
  // テスト前の処理をする関数初期化
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // テスト対象のサービスとその依存してる奴ら
      providers: [
        PostMessageService,
        {
          // provideをuseValueでmockした
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();
    service = module.get<PostMessageService>(PostMessageService);
  });
  describe('post-message', () => {
    it('should successfully insert a message', () => {
      expect(
        service.postMessage({
          authorId: mockMsg.authorId,
          content: mockMsg.content,
        }),
      ).resolves.toEqual(mockMsg);
    });
  });
});
