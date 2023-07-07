import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@mui/material';

import { FormInput } from '@/components/Elements/Input/FormInput';

import { useSignUp } from '../api/userSignUp';
import { SignUpDto, SignUpDtoSchema } from '../types/UserDto';

export const SignUpForm = () => {
  const signUp = useSignUp();
  const methods = useForm<SignUpDto>({
    resolver: zodResolver(SignUpDtoSchema),
  });

  const handleSignUp: SubmitHandler<SignUpDto> = (data) => {
    signUp(data.username, data.email, data.hashedPassword);
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSignUp)}>
          <FormInput name="username" type="text" start="username :" />
          <br />
          <FormInput name="email" type="text" start="email    :" />
          <br />
          <FormInput
            name="hashedPassword"
            type="password"
            start="password : "
          />
          <Button type="submit">SignUp</Button>
        </form>
      </FormProvider>
    </>
  );
};
