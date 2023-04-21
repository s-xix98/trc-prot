import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.upsert({
    where: {
      email: 'hoge@test.com',
    },
    update: {},
    create: {
      email: 'hoge@test.com',
      nickname: 'hoge',
      hashedPassword: 'a',
    },
  });
  const user2 = await prisma.user.upsert({
    where: {
      email: 'hage@test.com',
    },
    update: {},
    create: {
      email: 'hage@test.com',
      nickname: 'hage',
      hashedPassword: 'b',
    },
  });
  console.log(user1, user2);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
