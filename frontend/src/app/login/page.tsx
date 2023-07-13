'use client';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useState } from 'react';

import { MainLayout } from '@/components/Layout/MainLayout';
import { LoginForm } from '@/features/user/components/LoginForm';
import { SignUpForm } from '@/features/user/components/SignUpForm';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useDelayedPageTransition } from '@/hooks/useDelayedPageTransition';

// TODO tmp
const Pien = () => {
  useDelayedPageTransition('/', 1000);
  return <h1>🥺</h1>;
};

// TODO : UI 改善する
export default function Login() {
  const { userInfo } = useCurrentUser();
  const [isLogin, setValue] = useState(true);

  const handleChange = (event: React.SyntheticEvent, newValue: boolean) => {
    setValue(newValue);
  };

  return (
    <>
      {!userInfo && (
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
      )}
      {userInfo && <Pien />}
    </>
  );
}
