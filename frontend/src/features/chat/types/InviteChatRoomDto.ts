import { z } from 'zod';

export const InviteChatRoomDtoSchema = z.object({
  chatRoomId: z.string(),
  targetId: z.string(),
});
export type InviteChatRoomDto = z.infer<typeof InviteChatRoomDtoSchema>;
