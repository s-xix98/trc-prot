import { Test, TestingModule } from '@nestjs/testing';
import { PostMessageService } from './post-message.service';
import { PrismaService } from '../prisma/prisma.service';

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
