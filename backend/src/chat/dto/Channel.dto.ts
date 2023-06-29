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
