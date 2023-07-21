import { z } from 'zod';

import { UserInfoSchema } from '@/features/user/types/UserDto';

export const MatchHistoryDtoSchema = z.object({
  player1: UserInfoSchema,
  player2: UserInfoSchema,
  winner: UserInfoSchema.or(z.null()),
  createdAt: z.date(),
});
export type MatchHistoryDto = z.infer<typeof MatchHistoryDtoSchema>;

export const MatchHistoryArrDtoSchema = MatchHistoryDtoSchema.array();
export type MatchHistoryArrDto = z.infer<typeof MatchHistoryArrDtoSchema>;
