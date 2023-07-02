export type chatChannelDto = {
  id: string;
  roomName: string;
};

export type UpdateRoomMemberRoleDto = {
  role: 'ADMIN' | 'USER';
};

export type RoomMemberRestrictionDto = {
  chatRoomId: string;
  userId: string;
  targetId: string;
  endedAt: Date;
  state: 'BANNED' | 'MUTED';
}