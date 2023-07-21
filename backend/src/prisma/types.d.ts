import { PrismaService } from './prisma.service';

type PrsimaClientTx = Omit<
  PrismaService,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
>;
