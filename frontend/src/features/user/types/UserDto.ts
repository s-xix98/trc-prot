import { z } from 'zod';

export const SignUpDtoSchema = z.object({
  email: z.string().email(),
  username: z.string(),
  hashedPassword: z.string().min(3),
});
export type SignUpDto = z.infer<typeof SignUpDtoSchema>;

export const LoginDtoSchema = z.object({
  email: z.string().email(),
  hashedPassword: z.string().min(3),
});
export type LoginDto = z.infer<typeof LoginDtoSchema>;

export const UserInfoSchema = z.object({
  id: z.string(),
  username: z.string(),
  // TODO : null が来ることがある？
  base64Image: z.string().nullable().optional(),
  state: z
    .union([z.literal('ONLINE'), z.literal('OFFLINE'), z.literal('GAME')])
    .optional(),
});
export type UserInfo = z.infer<typeof UserInfoSchema>;

export const UserInfoArrSchema = UserInfoSchema.array();
export type UserInfoArr = z.infer<typeof UserInfoArrSchema>;
