'use client';

import { useState } from 'react';

import { Chat } from './features/chat/components/Chat';
import { Game } from './features/game/Game';
import { MainLayout } from './components/Layout/MainLayout';
import { useSessionSocket } from './hooks/useSocket';
import { Terminal } from './features/terminal/Terminal';
import { UserSearch } from './features/user/components/Search';
import { Matching } from './features/game/Matching';
import { useCurrentUser } from './hooks/useCurrentUser';
import { Friends } from './features/user/components/Friends';
import { Blocks } from './features/user/components/Blocks';
import { FriendRequests } from './features/user/components/FriendRequests';
import { useModal } from './hooks/useModal';
import { ModalView } from './components/Elements/Modal/ModalView';
import { History, Ranking } from './features/user/components/Tmp';

const onConnect = () => {
  console.log('socket connect');
};

const onDisconnect = () => {
  console.log('socket disconnect');
};

const Launcher = ({
  commandElemMap,
}: {
  commandElemMap: Map<string, JSX.Element>;
}) => {
  const { modalIsOpen, openModal, closeModal } = useModal();
  const [currentModalElem, setCurrentModalElem] = useState<JSX.Element>();

  return (
    <>
      <h1>LAUNCHER</h1>
      <ModalView modalIsOpen={modalIsOpen} closeModal={closeModal}>
        {currentModalElem}
      </ModalView>

      {Array.from(commandElemMap.entries()).map((val, key) => (
        <h3
          key={key}
          onClick={() => {
            setCurrentModalElem(val[1]);
            openModal();
          }}
        >
          {val[0]}
        </h3>
      ))}
    </>
  );
};

function App() {
  // TODO : 消す、login ページに飛ぶ前に、ページ見えちゃうの嫌なので一旦
  const { currentUserInfo } = useCurrentUser();

  useSessionSocket('connect', onConnect);
  useSessionSocket('disconnect', onDisconnect);

  //useSessionSocket()

  const commandElemMap = new Map<string, JSX.Element>();

  commandElemMap.set('a', <h1>A</h1>);
  commandElemMap.set('b', <h2>B</h2>);
  commandElemMap.set('c', <h3>c</h3>);
  commandElemMap.set('g', <Game />);
  commandElemMap.set('m', <Matching />);
  commandElemMap.set('h', <History />);
  commandElemMap.set('r', <Ranking />);
  commandElemMap.set('./help', <h3>質問の背景を教えてください。</h3>);
  commandElemMap.set('./game', <Game />);
  commandElemMap.set('./chat', <Chat />);
  commandElemMap.set('./search', <UserSearch />);
  commandElemMap.set('./friends', <Friends />);
  commandElemMap.set('./friendsReq', <FriendRequests />);
  commandElemMap.set('./blocks', <Blocks />);

  // TODO : 消す or もうちょいちゃんと作る
  const forLauncherCommandElemMap = new Map(commandElemMap);
  commandElemMap.set(
    'l',
    <Launcher commandElemMap={forLauncherCommandElemMap} />,
  );

  return (
    <MainLayout>
      {currentUserInfo && <Terminal commandElemMap={commandElemMap} />}
    </MainLayout>
  );
}

export default App;
