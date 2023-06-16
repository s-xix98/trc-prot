'use client';

import { MainLayout } from '@/components/Layout/MainLayout';
import { useRedirectToHome } from '@/hooks/useLogin';

import { User } from '../../features/user/components/User';

// TODO : UI 改善する
export default function Login() {
  useRedirectToHome();

  return (
    <MainLayout>
      <User>
        <div style={{ margin: 'auto' }}>
          <h1>Please login</h1>
        </div>
      </User>
    </MainLayout>
  );
}
