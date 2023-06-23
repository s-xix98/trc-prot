import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useSignUp } from '../api/userSignUp';
import { SignUpDto, SignUpDtoSchema } from '../types/UserDto';

export const SignUpForm = () => {
  const signUp = useSignUp();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpDto>({
    resolver: zodResolver(SignUpDtoSchema),
  });

  const handleSignUp: SubmitHandler<SignUpDto> = (data) => {
    signUp(data.username, data.email, data.hashedPassword);
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleSignUp)}>
        <input {...register('username')} placeholder="username" />
        {errors.username?.message && <span>{errors.username.message}</span>}
        <input {...register('email')} placeholder="email" />
        {errors.email?.message && <span>{errors.email.message}</span>}
        <input {...register('hashedPassword')} placeholder="password" />
        {errors.hashedPassword && <span>{errors.hashedPassword.message}</span>}
        <input type="submit" />
      </form>
    </>
  );
};
