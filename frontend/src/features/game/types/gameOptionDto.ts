import { z } from 'zod';

import { UserInfoSchema } from '@/features/user/types/UserDto';

export const GameOptionDtoSchema = z.object({
  ballSpeed: z.number(),
  matchpoint: z.number(),
});
export type GameOptionDto = z.infer<typeof GameOptionDtoSchema>;

export const UserGameOptionSchema = z.object({
  user: UserInfoSchema,
  opt: GameOptionDtoSchema,
});
export type UserGameOption = z.infer<typeof UserGameOptionSchema>;
