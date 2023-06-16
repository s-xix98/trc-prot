'use client';

import { MainLayout } from '@/components/Layout/MainLayout';
import { User } from '@/features/user/components/User';
import { useRedirectToHome } from '@/hooks/useLogin';

export default function Login() {
  useRedirectToHome();

  return (
    <MainLayout>
      <h1>Login</h1>
      <User>
        <p>none</p>
      </User>
    </MainLayout>
  );
}
