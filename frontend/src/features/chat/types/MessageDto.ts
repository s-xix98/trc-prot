// バックエンドの方と同じデータ構造

export type MessageDto = {
  content: string;
  authorId: number;
};

export type handleMessageDto = {
  nickname: string;
  msg: string;
};
