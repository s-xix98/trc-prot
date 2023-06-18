// バックエンドの方と同じデータ構造

export type MessageDto = {
  content: string;
  authorId: string;
};

export type handleMessageDto = {
  username: string;
  msg: string;
};

export type sendMessageDto = {
  content: string,
  // TODO authができたらheaderからuserID取り出せるから消す
  userId: string,
  chatRoomId: string,
}