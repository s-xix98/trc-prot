import { Socket } from "socket.io-client";
import { User } from "@prisma/client";

export type testUser = {
  user: User;
  socket: Socket;
};
