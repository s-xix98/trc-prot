export class JoinChannelDto {
  chatRoomId: string;
  password?: string;
}
export class CreateChannelDto {
  roomName: string;
  password?: string;
  isPrivate?: boolean;
}

export class UpdateRoomMemberRoleDto {
  role: 'ADMIN' | 'USER';
}

export class RoomMemberRestrictionDto {
  chatRoomId: string;
  targetId: string;
  duration: number;
}

export class KickRoomMemberDto {
  chatRoomId: string;
  targetId: string;
}

export class InviteChatRoomDto {
  chatRoomId: string;
  targetId: string;
}

export class AcceptChatInvitationDto {
  chatRoomId: string;
  inviterId: string;
}

export class LeaveRoomDto {
  chatRoomId: string;
}

export class RejectChatInvitationDto {
  chatRoomId: string;
  inviterId: string;
}

export class UpdateChatRoomDto {
  chatRoomId: string;
  roomName?: string;
  password?: string | null;
  isPrivate?: boolean;
}
