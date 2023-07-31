import { z } from 'zod';

export const chatChannelSchema = z.object({
  id: z.string(),
  roomName: z.string(),
  isPrivate: z.boolean().optional(),
  hasPassword: z.boolean().optional(),
  isDM: z.boolean().optional(),
});
export type chatChannelDto = z.infer<typeof chatChannelSchema>;

export type UpdateRoomMemberRoleDto = {
  role: 'ADMIN' | 'USER';
};

export type RoomMemberRestrictionDto = {
  chatRoomId: string;
  targetId: string;
  duration: number;
};
