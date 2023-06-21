'use client';

import { useSetAtom } from 'jotai';

import { Chat } from './features/chat/components/Chat';
import { Game } from './features/game/Game';
import { MainLayout } from './components/Layout/MainLayout';
import { useSocket } from './hooks/useSocket';
import { Terminal } from './features/terminal/Terminal';
import { SearchUserOrChannel } from './features/user/components/Search';
import { channelListAtom } from './stores/jotai';
import { Matching } from './features/game/Matching';
import { useCurrentUser } from './hooks/useCurrentUser';

const onConnect = () => {
  console.log('socket connect');
};

const onDisconnect = () => {
  console.log('socket disconnect');
};

function App() {
  // TODO : 消す、login ページに飛ぶ前に、ページ見えちゃうの嫌なので一旦
  const { userInfo } = useCurrentUser();
  const setChannelList = useSetAtom(channelListAtom);

  useSocket('addRoom', (data) => {
    console.log('addRoom', data);
    setChannelList((prev) => [...prev, data]);
  });
  useSocket('connect', onConnect);
  useSocket('disconnect', onDisconnect);

  // useSocket()

  const commandElemMap = new Map<string, JSX.Element>();

  commandElemMap.set('a', <h1>A</h1>);
  commandElemMap.set('b', <h2>B</h2>);
  commandElemMap.set('c', <h3>c</h3>);
  commandElemMap.set('g', <Game />);
  commandElemMap.set('m', <Matching />);
  commandElemMap.set('./game', <Game />);
  commandElemMap.set('./chat', <Chat />);
  commandElemMap.set('./search', <SearchUserOrChannel />);

  return (
    <MainLayout>
      {!userInfo && <h1>GO LOGIN PAGE</h1>}
      {userInfo && <Terminal commandElemMap={commandElemMap} />}
    </MainLayout>
  );
}

export default App;
