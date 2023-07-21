import { z } from 'zod';

import { chatChannelSchema } from '@/features/chat/types/chatChannelDto';
import { ReceiveInviteChatRoomDtoSchema } from '@/features/chat/types/InviteChatRoomDto';

export const SignUpDtoSchema = z.object({
  email: z.string().email(),
  username: z.string(),
  hashedPassword: z.string().min(3),
});
export type SignUpDto = z.infer<typeof SignUpDtoSchema>;

export const LoginDtoSchema = z.object({
  email: z.string().email(),
  hashedPassword: z.string().min(3),
});
export type LoginDto = z.infer<typeof LoginDtoSchema>;

export const UserInfoSchema = z.object({
  id: z.string(),
  username: z.string(),
});
export type UserInfo = z.infer<typeof UserInfoSchema>;

export const UserInfoArrSchema = UserInfoSchema.array();
export type UserInfoArr = z.infer<typeof UserInfoArrSchema>;

export const CurrentUserSchema = z.object({
  userInfo: UserInfoSchema,
  friends: UserInfoSchema.array(),
  friendRequests: UserInfoSchema.array(),
  blockUsers: UserInfoSchema.array(),
  joinedRooms: chatChannelSchema.array(),
  receiveInviteChatRooms: ReceiveInviteChatRoomDtoSchema.array(),
});
export type CurrentUser = z.infer<typeof CurrentUserSchema>;
