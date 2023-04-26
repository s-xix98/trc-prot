import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.upsert({
    where: {
      email: 'huga@example.com',
    },
    update: {},
    create: {
      email: 'huga@example.com',
      nickname: 'huga',
      hashedPassword: 'hugahuga',
    },
  });
  const user2 = await prisma.user.upsert({
    where: {
      email: 'piyo@example.com',
    },
    update: {},
    create: {
      email: 'piyo@example.com',
      nickname: 'piyo',
      hashedPassword: 'piyopiyo',
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
