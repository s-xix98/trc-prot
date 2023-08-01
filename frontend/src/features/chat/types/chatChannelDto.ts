import { z } from 'zod';

import { UserInfoSchema } from '@/features/user/types/UserDto';

const UserRole = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  USER: 'USER',
};

const roomMemberSchema = z.object({
  user: UserInfoSchema,
  role: z.union([
    z.literal(UserRole.OWNER),
    z.literal(UserRole.ADMIN),
    z.literal(UserRole.USER),
  ]),
});
export type roomMember = z.infer<typeof roomMemberSchema>;

export const chatChannelSchema = z.object({
  id: z.string(),
  roomName: z.string(),
  isPrivate: z.boolean().optional(),
  hasPassword: z.boolean().optional(),
  isDM: z.boolean().optional(),
  roomMembers: z.array(roomMemberSchema).optional(),
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
