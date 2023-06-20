import { PrismaClient } from '@prisma/client';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const authProvider1 = await prisma.authProvider.upsert({
    where: {
      name: '42-school',
    },
    update: {},
    create: {
      name: '42-school',
    },
  });
  const authProvider2 = await prisma.authProvider.upsert({
    where: {
      name: 'google',
    },
    update: {},
    create: {
      name: 'google',
    },
  });

  const hugaPassword = await bcrypt.hash('hugahuga', 10);
  const user1 = await prisma.user.upsert({
    where: {
      email: 'huga@example.com',
    },
    update: {},
    create: {
      email: 'huga@example.com',
      username: 'huga',
      hashedPassword: hugaPassword,
    },
  });

  const piyoPassword = await bcrypt.hash('piyopiyo', 10);
  const user2 = await prisma.user.upsert({
    where: {
      email: 'piyo@example.com',
    },
    update: {},
    create: {
      email: 'piyo@example.com',
      username: 'piyo',
      hashedPassword: piyoPassword,
    },
  });
  const room = await prisma.chatRoom.create({
    data: {
      roomName: 'hogeRoom',
    },
  });
  const roomMember1 = await prisma.roomMember.upsert({
    where: {
      userId_chatRoomId: {
        userId: user1.id,
        chatRoomId: room.id,
      },
    },
    update: {},
    create: {
      userId: user1.id,
      chatRoomId: room.id,
      role: UserRole.OWNER,
    },
  });
  const roomMember2 = await prisma.roomMember.upsert({
    where: {
      userId_chatRoomId: {
        userId: user2.id,
        chatRoomId: room.id,
      },
    },
    update: {},
    create: {
      userId: user2.id,
      chatRoomId: room.id,
    },
  });
  console.log(authProvider1, authProvider2);
  console.log(user1, user2);
  console.log(room, roomMember1, roomMember2);
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
