import { z } from 'zod';

import { UserInfoSchema } from '../../user/types/UserDto';

// バックエンドの方と同じデータ構造

export const MessageDtoSchema = z.object({
  content: z.string(),
  authorId: z.string(),
});
export type MessageDto = z.infer<typeof MessageDtoSchema>;

export const handleMessageDtoSchema = z.object({
  content: z.string(),
  user: UserInfoSchema,
});
export type handleMessageDto = z.infer<typeof handleMessageDtoSchema>;

export const handleMessageDtoArrSchema = handleMessageDtoSchema.array();
export type handleMessageDtoArr = z.infer<typeof handleMessageDtoArrSchema>;

export const sendMessageDtoSchema = z.object({
  content: z.string(),
  // TODO authができたらheaderからuserID取り出せるから消す
  chatRoomId: z.string(),
});
export type sendMessageDto = z.infer<typeof sendMessageDtoSchema>;
