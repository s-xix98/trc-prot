import { z } from 'zod';

import { chatChannelSchema } from '@/features/chat/types/chatChannelDto';
import { ReceiveInviteChatRoomDtoSchema } from '@/features/chat/types/InviteChatRoomDto';

import { UserInfoSchema } from './UserDto';

export const CurrentUserSchema = z.object({
  userInfo: UserInfoSchema,
  friends: UserInfoSchema.array(),
  friendRequests: UserInfoSchema.array(),
  blockUsers: UserInfoSchema.array(),
  joinedRooms: chatChannelSchema.array(),
  receiveInviteChatRooms: ReceiveInviteChatRoomDtoSchema.array(),
});
export type CurrentUser = z.infer<typeof CurrentUserSchema>;
