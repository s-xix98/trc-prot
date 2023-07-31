import { z } from 'zod';

export const UpdateChatRoomDtoSchema = z.object({
  chatRoomId: z.string(),
  roomName: z.string().optional(),
  password: z.string().nullable().optional(),
  isPrivate: z.boolean().optional(),
});
export type UpdateChatRoomDto = z.infer<typeof UpdateChatRoomDtoSchema>;
