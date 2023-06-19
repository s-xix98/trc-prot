import { UserInfo } from '../../user/types/UserDto';
// バックエンドの方と同じデータ構造

export type MessageDto = {
  content: string;
  authorId: string;
};

export type handleMessageDto = {
  content: string;
  user: UserInfo;
};

export type sendMessageDto = {
  content: string;
  // TODO authができたらheaderからuserID取り出せるから消す
  userId: string;
  chatRoomId: string;
};
