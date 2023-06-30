export type chatChannelDto = {
  id: string;
  roomName: string;
};

export type UpdateRoomMemberRoleDto = {
  role: 'ADMIN' | 'USER';
};
