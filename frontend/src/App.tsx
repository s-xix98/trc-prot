import { useEffect } from 'react';

import { socket } from './socket';
import { User } from './features/user/components/user';
import { Chat } from './features/chat/components/Chat';
import { MainLayout } from './components/Layout/MainLayout';

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
