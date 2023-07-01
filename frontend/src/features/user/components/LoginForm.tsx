import {
  SubmitHandler,
  useForm,
  Controller,
  FormProvider,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { FormInput } from '@/components/Elements/Input/FormInput';

import { useLogin } from '../api/userLogin';
import { LoginDtoSchema, LoginDto } from '../types/UserDto';

export const LoginForm = () => {
  const login = useLogin();
  const methods = useForm<LoginDto>({ resolver: zodResolver(LoginDtoSchema) });

  const handleLogin: SubmitHandler<LoginDto> = (data) => {
    login(data.email, data.hashedPassword);
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleLogin)}>
          <FormInput name="email" type="text" start="email : " />
          <br />
          <FormInput
            name="hashedPassword"
            type="password"
            start="password : "
          />
          <input type="submit" value="Login" />
        </form>
      </FormProvider>
    </>
  );
};
