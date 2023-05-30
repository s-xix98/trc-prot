import { PrismaClient } from '@prisma/client';
import { UserRole } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.upsert({
    where: {
      email: 'huga@example.com',
    },
    update: {},
    create: {
      email: 'huga@example.com',
      username: 'huga',
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
      username: 'piyo',
      hashedPassword: 'piyopiyo',
    },
  });
  const room = await prisma.chatRoom.upsert({
    where: {
      roomName: 'hogeRoom',
    },
    update: {},
    create: {
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
