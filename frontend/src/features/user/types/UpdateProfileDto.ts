import { z } from 'zod';

export const UserProfileDtoSchema = z.object({
  // TODO : user name type
  username: z.string().min(1).optional(),
  // backend が buffer になってるけど、とりあえず、stringで
  base64Image: z.string().optional(),
});
export type UserProfileDto = z.infer<typeof UserProfileDtoSchema>;
