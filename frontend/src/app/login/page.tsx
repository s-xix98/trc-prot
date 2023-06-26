'use client';

import { MainLayout } from '@/components/Layout/MainLayout';
import { useRedirectToHome } from '@/hooks/useLogin';

import { LoginForm } from '@/features/user/components/LoginForm';
import { SignUpForm } from '@/features/user/components/SignUpForm';

// TODO : UI 改善する
export default function Login() {
  useRedirectToHome();

  return (
    <MainLayout>
      <h1>Login</h1>
      <br />
      <h2>LoginForm</h2>
      <LoginForm />
      <br />
      <h2>SignUpForm</h2>
      <SignUpForm />
    </MainLayout>
  );
}
