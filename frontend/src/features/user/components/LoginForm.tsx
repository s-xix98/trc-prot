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
        <input type="submit" value="Login" />
        {errors.hashedPassword && (
          <p style={{ color: 'red' }}>{errors.hashedPassword.message}</p>
        )}
      </form>
    </>
  );
};
