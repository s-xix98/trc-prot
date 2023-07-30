import { z } from 'zod';

export const chatChannelSchema = z.object({
  id: z.string(),
  roomName: z.string(),
  isPrivate: z.boolean(),
  hasPassword: z.boolean(),
});
export type chatChannelDto = z.infer<typeof chatChannelSchema>;

export type UpdateRoomMemberRoleDto = {
  role: 'ADMIN' | 'USER';
};

export type RoomMemberRestrictionDto = {
  chatRoomId: string;
  targetId: string;
  endedAt: Date;
};
