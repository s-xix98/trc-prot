import { z } from 'zod';

export const KickRoomMemberDtoSchema = z.object({
  chatRoomId: z.string(),
  targetId: z.string(),
});
export type KickRoomMemberDto = z.infer<typeof KickRoomMemberDtoSchema>;
