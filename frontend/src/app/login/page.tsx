'use client';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useState } from 'react';

import { MainLayout } from '@/components/Layout/MainLayout';
import { useRedirectToHome } from '@/hooks/useLogin';
import { LoginForm } from '@/features/user/components/LoginForm';
import { SignUpForm } from '@/features/user/components/SignUpForm';


// TODO : UI 改善する
export default function Login() {
  useRedirectToHome();

  const [isLogin, setValue] = useState(true);

  const handleChange = (event: React.SyntheticEvent, newValue: boolean) => {
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
          <Tab value={true} label="Login" />
          <Tab value={false} label="SignUp" />
        </Tabs>
      </Box>
      <br />
      {isLogin && <LoginForm />}
      {!isLogin && <SignUpForm />}
    </MainLayout>
  );
}
