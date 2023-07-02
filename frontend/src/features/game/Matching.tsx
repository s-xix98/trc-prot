import { useEffect, useState } from 'react';

import { useSocket } from '@/hooks/useSocket';
import { socket } from '@/socket';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Container } from '@/components/Layout/Container';

import { Game } from './Game';

export const Matching = () => {
  const [isMatched, setMatched] = useState(false);
  const { userInfo } = useCurrentUser();

  useSocket('matched', (side: number, enemyName: string) => {
    console.log(side, enemyName);
    setMatched(true);
  });
  useSocket('already playing', () => {
    console.log('already playing');
  });
  useSocket('enemy diconnected', () => {
    console.log('enemy diconnected');
  });

  useEffect(() => {
    return () => {
      socket.emit('clear match', userInfo?.id);
    };
  }, [userInfo]);

  const onClickAct = () => {
    socket.emit('matchmake', userInfo);
  };
  // console.log("ui", userInfo);
  return (
    <Container flexDirection={'column'}>
      <div>
        <button onClick={onClickAct}>button</button>
        {isMatched && <Game />}
        {!isMatched && <h1> WAITING... </h1>}
      </div>
    </Container>
  );
};
