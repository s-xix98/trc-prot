import { SubmitHandler, useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@mui/material';

import { FormInput } from '@/components/Elements/Input/FormInput';

import { useLogin } from '../api/userLogin';
import { LoginDtoSchema, LoginDto } from '../types/UserDto';

export const LoginForm = () => {
  const { manualLogin } = useLogin();
  const methods = useForm<LoginDto>({ resolver: zodResolver(LoginDtoSchema) });

  const handleLogin: SubmitHandler<LoginDto> = (data) => {
    manualLogin(data.email, data.hashedPassword);
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleLogin)}>
          <FormInput name="email" type="text" start="email    :" />
          <br />
          <FormInput name="hashedPassword" type="password" start="password :" />
          <Button type="submit">Login</Button>
        </form>
      </FormProvider>
    </>
  );
};
