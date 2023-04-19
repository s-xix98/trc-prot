import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
// https://docs.nestjs.com/providers
// 様々な場所で使うはずなのでimportするだけで使えるように
@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private readonly config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }
}
