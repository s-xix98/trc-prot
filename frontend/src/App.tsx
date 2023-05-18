'use client';

import { atom } from 'jotai';

// import { User } from './features/user/components/User';
// import { Chat } from './features/chat/components/Chat';
import { UserInfo } from './features/user/types/UserDto';
import { MainLayout } from './components/Layout/MainLayout';
import { useSocket } from './hooks/useSocket';
import { Terminal } from './components/Elements/Terminal/Terminal';

// TODO : 変数 の 場所 移動 させる
export const userInfoAtom = atom<UserInfo | undefined>(undefined);

const onConnect = () => {
  console.log('socket connect');
};

const onDisconnect = () => {
  console.log('socket disconnect');
};

function App() {
  useSocket('connect', onConnect);
  useSocket('disconnect', onDisconnect);

  // useSocket()

  return (
    <MainLayout>
      <Terminal />
    </MainLayout>
  );
}

export default App;
