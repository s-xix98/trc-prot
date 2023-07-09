import { FriendshipStatus } from "@prisma/client";

export type UserInfo = {
  id: string;
  username: string;
  status: FriendshipStatus | undefined;
};
