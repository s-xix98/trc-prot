import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';

import { PostMessageService } from './post-message.service';

type Message = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  authorId: string;
};
const mockMsg: Message = {
  id: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
  content: 'nori',
  authorId: '2',
};

const mockPrismaService = {
  message: {
    // PrismaService.createをmockMsgを返すだけの関数にした
    create: jest.fn().mockReturnValue(mockMsg),
  },
  chatRoom: {
    findUnique: jest.fn().mockReturnValue({ id: '1' }),
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
          // PostMessageServiceのコンストラクターでuseValueのmockPrismaService使う
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
