export class JoinChannelDto {
  chatRoomId: string;
  userId: string;
}
export class CreateChannelDto {
  roomName: string;
  userId: string;
  password?: string;
}
