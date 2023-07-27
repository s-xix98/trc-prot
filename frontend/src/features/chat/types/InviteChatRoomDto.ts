import { z } from 'zod';

import { UserInfoSchema } from '@/features/user/types/UserDto';

import { chatChannelSchema } from './chatChannelDto';

export const InviteChatRoomDtoSchema = z.object({
  chatRoomId: z.string(),
  targetId: z.string(),
});
export type InviteChatRoomDto = z.infer<typeof InviteChatRoomDtoSchema>;

export const ReceiveInviteChatRoomDtoSchema = z.object({
  chatRoom: chatChannelSchema,
  inviter: UserInfoSchema,
});
export type ReceiveInviteChatRoomDto = z.infer<
  typeof ReceiveInviteChatRoomDtoSchema
>;

export const AcceptChatInvitationDtoSchema = z.object({
  chatRoomId: z.string(),
  inviterId: z.string(),
});
export type AcceptChatInvitationDto = z.infer<
  typeof AcceptChatInvitationDtoSchema
>;
