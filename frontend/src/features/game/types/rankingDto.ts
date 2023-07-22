import { z } from 'zod';

import { UserInfoSchema } from '@/features/user/types/UserDto';

export const RateDtoSchema = z.object({
  userData: UserInfoSchema,
  rating: z.number(),
});
export type RateDto = z.infer<typeof RateDtoSchema>;

export const RateArrDtoSchema = RateDtoSchema.array();
export type RateArr = z.infer<typeof RateArrDtoSchema>;
