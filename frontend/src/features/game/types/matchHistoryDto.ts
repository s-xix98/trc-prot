import { z } from 'zod';

import { UserInfoSchema } from '@/features/user/types/UserDto';

export const MatchHistoryDtoSchema = z.object({
  player1: UserInfoSchema,
  player2: UserInfoSchema,
  winner: UserInfoSchema.or(z.null()),
  // TODO : date のはずだけど、 zod parse がエラー吐くので、
  // とりえあず、 string
  createdAt: z.string(),
});
export type MatchHistoryDto = z.infer<typeof MatchHistoryDtoSchema>;

export const MatchHistoryArrDtoSchema = MatchHistoryDtoSchema.array();
export type MatchHistoryArrDto = z.infer<typeof MatchHistoryArrDtoSchema>;
