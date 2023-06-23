import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useLogin } from '../api/userLogin';
import { LoginDtoSchema, LoginDto } from '../types/UserDto';

export const LoginForm = () => {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: zodResolver(LoginDtoSchema),
  });

  const handleLogin: SubmitHandler<LoginDto> = (data) => {
    login(data.email, data.hashedPassword);
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleLogin)}>
        <input {...register('email')} placeholder="email" />
        {errors.email?.message && <span>{errors.email.message}</span>}
        <input {...register('hashedPassword')} placeholder="password" />
        {errors.hashedPassword && <span>{errors.hashedPassword.message}</span>}
        <input type="submit" />
      </form>
    </>
  );
};
