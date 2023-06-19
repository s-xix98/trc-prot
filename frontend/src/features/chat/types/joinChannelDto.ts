export type joinChannelDto = {
  // TODO auth認証ができたらheaderからidを取り出せるから、auth実装後userIdを削除
  userId: string;
  chatRoomId: string;
};
