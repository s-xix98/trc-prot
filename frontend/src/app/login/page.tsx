'use client';

import { MainLayout } from '@/components/Layout/MainLayout';
import { User } from '@/features/user/components/User';

export default function Login() {
  return (
    <MainLayout>
      <h1>Login</h1>
      <User>
        <p>none</p>
      </User>
    </MainLayout>
  );
}
