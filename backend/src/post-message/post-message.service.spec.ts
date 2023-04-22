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
  }
};
describe('PostMessageService', () => {
  let service: PostMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostMessageService],
    }).compile();

    service = module.get<PostMessageService>(PostMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
