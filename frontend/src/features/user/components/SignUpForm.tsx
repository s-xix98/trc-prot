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
        <span>username : </span>
        <input {...register('username')} placeholder="username" />
        {errors.username?.message ? (
          <p style={{ color: 'red' }}>{errors.username.message}</p>
        ) : (
          <br />
        )}

        <span>email &nbsp;&nbsp;&nbsp;: </span>
        <input {...register('email')} placeholder="email" />
        {errors.email?.message ? (
          <p style={{ color: 'red' }}>{errors.email.message}</p>
        ) : (
          <br />
        )}

        <span>password : </span>
        <input {...register('hashedPassword')} placeholder="password" />
        <span>&nbsp;</span>
        <input type="submit" value="SignUp" />
        {errors.hashedPassword && (
          <p style={{ color: 'red' }}>{errors.hashedPassword.message}</p>
        )}
      </form>
    </>
  );
};
