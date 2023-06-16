'use client';

import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { getSession } from 'next-auth/react';

import { User } from './features/user/components/User';
import { Chat } from './features/chat/components/Chat';
import { Game } from './features/game/Game';
import { MainLayout } from './components/Layout/MainLayout';
import { useSocket } from './hooks/useSocket';
import { Terminal } from './features/terminal/Terminal';
import { SearchUser } from './features/user/components/Search';
import { channelListAtom } from './stores/jotai';
import { useRequireLogin } from './hooks/useLogin';

const onConnect = () => {
  console.log('socket connect');
};

const onDisconnect = () => {
  console.log('socket disconnect');
};

export const PrevApp = () => {
  return (
    <User>
      <Chat />
    </User>
  );
};

function App() {
  const setChannelList = useSetAtom(channelListAtom);
  // 確認用
  useEffect(() => {
    const f = async () => {
      const session = await getSession();
      return session;
    };

    f()
      .then((session) => {
        console.log('session', session);
        // sessionプロパティにjwtがないので、とりあえずnameを使う
        localStorage.setItem(
          'access_token',
          session?.accessToken || 'mock jwt',
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useSocket('addRoom', (data) => {
    console.log('addRoom', data);
    setChannelList((prev) => [...prev, data]);
  });
  useSocket('connect', onConnect);
  useSocket('disconnect', onDisconnect);

  useRequireLogin();

  // useSocket()

  const commandElemMap = new Map<string, JSX.Element>();

  commandElemMap.set('a', <h1>A</h1>);
  commandElemMap.set('b', <h2>B</h2>);
  commandElemMap.set('c', <h3>c</h3>);
  commandElemMap.set('p', <PrevApp />);
  commandElemMap.set('g', <Game />);
  commandElemMap.set('./game', <Game />);
  commandElemMap.set('./chat', <PrevApp />);
  commandElemMap.set('./search', <SearchUser />);

  return (
    <MainLayout>
      <Terminal commandElemMap={commandElemMap} />
    </MainLayout>
  );
}

export default App;
