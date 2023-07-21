export class JoinChannelDto {
  chatRoomId: string;
  userId: string;
  password?: string;
}
export class CreateChannelDto {
  roomName: string;
  userId: string;
  password?: string;
  isPrivate?: boolean;
}

export class UpdateRoomMemberRoleDto {
  role: 'ADMIN' | 'USER';
}

export class RoomMemberRestrictionDto {
  chatRoomId: string;
  userId: string;
  targetId: string;
  endedAt: Date;
}

export class InviteChatRoomDto {
  chatRoomId: string;
  targetId: string;
}

export class LeaveRoomDto {
  chatRoomId: string;
}
