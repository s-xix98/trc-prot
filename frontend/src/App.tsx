'use client';

import { useSetAtom } from 'jotai';

import { Chat } from './features/chat/components/Chat';
import { Game } from './features/game/Game';
import { MainLayout } from './components/Layout/MainLayout';
import { useSessionSocket } from './hooks/useSocket';
import { Terminal } from './features/terminal/Terminal';
import { UserSearch } from './features/user/components/Search';
import { channelListAtom } from './stores/jotai';
import { Matching } from './features/game/Matching';
import { useCurrentUser } from './hooks/useCurrentUser';
import { Friends } from './features/user/components/Friends';
import { Blocks } from './features/user/components/Blocks';

const onConnect = () => {
  console.log('socket connect');
};

const onDisconnect = () => {
  console.log('socket disconnect');
};

function App() {
  // TODO : 消す、login ページに飛ぶ前に、ページ見えちゃうの嫌なので一旦
  const { currentUserInfo } = useCurrentUser();
  const setChannelList = useSetAtom(channelListAtom);

  useSessionSocket('addRoom', (data) => {
    console.log('addRoom', data);
    setChannelList((prev) => [...prev, data]);
  });

  useSessionSocket('error', (data) => {
    console.log(data);
  });

  useSessionSocket('friendRequests', (data) => {
    // friendRequestの処理を書く
    console.log('friendRequests', data);
  });

  useSessionSocket('friends', (data) => {
    console.log('friends', data);
  });

  useSessionSocket('blockUsers', (data) => {
    console.log('blockUsers', data);
  });

  useSessionSocket('connect', onConnect);
  useSessionSocket('disconnect', onDisconnect);

  //useSessionSocket()

  const commandElemMap = new Map<string, JSX.Element>();

  commandElemMap.set('a', <h1>A</h1>);
  commandElemMap.set('b', <h2>B</h2>);
  commandElemMap.set('c', <h3>c</h3>);
  commandElemMap.set('g', <Game />);
  commandElemMap.set('m', <Matching />);
  commandElemMap.set('./help', <h3>質問の背景を教えてください。</h3>);
  commandElemMap.set('./game', <Game />);
  commandElemMap.set('./chat', <Chat />);
  commandElemMap.set('./search', <UserSearch />);
  commandElemMap.set('./friends', <Friends />);
  commandElemMap.set('./blocks', <Blocks />);

  return (
    <MainLayout>
      {currentUserInfo && <Terminal commandElemMap={commandElemMap} />}
    </MainLayout>
  );
}

export default App;
