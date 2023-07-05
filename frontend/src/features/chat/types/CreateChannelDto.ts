import { z } from 'zod';

export const CreateChannelSchema = z.object({
  roomName: z.string().min(1),
  userId: z.string(),
  password: z.string().optional(),
  isPrivate: z.boolean().optional(),
});
export type CreateChannelDto = z.infer<typeof CreateChannelSchema>;
