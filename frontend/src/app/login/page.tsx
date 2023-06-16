'use client';

import { MainLayout } from '@/components/Layout/MainLayout';
import { User } from '@/features/user/components/User';
import { useRedirectToHome } from '@/hooks/useLogin';

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
