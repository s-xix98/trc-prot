'use client';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useState } from 'react';

import { MainLayout } from '@/components/Layout/MainLayout';
import { useRedirectToHome } from '@/hooks/useLogin';
import { LoginForm } from '@/features/user/components/LoginForm';
import { SignUpForm } from '@/features/user/components/SignUpForm';
import { AuthLogin } from '@/features/user/components/AuthLogin';
import { BACKEND } from '@/constants';
import { useReceiveAuthRedirect } from '@/features/user/api/authRedirect';

// TODO : UI 改善する
export default function Login() {
  useRedirectToHome();
  useReceiveAuthRedirect();

  const [isLogin, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <MainLayout>
      <Box sx={{ width: '100%' }}>
        <Tabs
          value={isLogin}
          onChange={handleChange}
          textColor="inherit"
          TabIndicatorProps={{ style: { backgroundColor: 'green' } }}
        >
          <Tab value={0} label="Login" />
          <Tab value={1} label="SignUp" />
          <Tab value={2} label="42Auth" />
          <Tab value={3} label="GoogleAuth" />
        </Tabs>
      </Box>
      <br />
      {isLogin === 0 && <LoginForm />}
      {isLogin === 1 && <SignUpForm />}
      {isLogin === 2 && <AuthLogin displayName={"42"} redirectUrl={BACKEND + "/auth/42"} />}
      {isLogin === 3 && <AuthLogin displayName={"google"} redirectUrl={BACKEND + "/auth/google"}/>}
    </MainLayout>
  );
}
