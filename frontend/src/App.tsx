import { useEffect } from 'react';
import { atom } from 'jotai';

import { socket } from './socket';
import { User } from './features/user/components/User';
import { Chat } from './features/chat/components/Chat';
import { UserInfo } from './features/user/types/UserDto';
import { MainLayout } from './components/Layout/MainLayout';

// TODO : 変数 の 場所 移動 させる
export const userInfoAtom = atom<UserInfo | undefined>(undefined);

const onConnect = () => {
  console.log('socket connect');
};

const onDisconnect = () => {
  console.log('socket disconnect');
};

function App() {
  useEffect(() => {
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <MainLayout>
      <User>
        <Chat />
      </User>
    </MainLayout>
  );
}

export default App;
