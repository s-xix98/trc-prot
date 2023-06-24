import { z } from 'zod';

export const SignUpDtoSchema = z.object({
  email: z.string().email(),
  username: z.string(),
  hashedPassword: z.string(),
});
export type SignUpDto = z.infer<typeof SignUpDtoSchema>;

export const LoginDtoSchema = z.object({
  email: z.string().email(),
  hashedPassword: z.string(),
});
export type LoginDto = z.infer<typeof LoginDtoSchema>;

export const UserInfoSchema = z.object({
  id: z.string(),
  username: z.string(),
});
export type UserInfo = z.infer<typeof UserInfoSchema>;
