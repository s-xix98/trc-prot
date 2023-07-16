import { useEffect, useState } from 'react';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Container } from '@/components/Layout/Container';
import { useSessionSocketEmitter, useSessionSocket } from '@/hooks/useSocket';

import { Game } from './Game';

export const Matching = () => {
  const [isMatched, setMatched] = useState(false);
  const { currentUserInfo } = useCurrentUser();
  const sessionSocketEmitter = useSessionSocketEmitter();

  useSessionSocket('matched', (side: number, enemyName: string) => {
    console.log(side, enemyName);
    setMatched(true);
  });
  useSessionSocket('already playing', () => {
    console.log('already playing');
  });
  useSessionSocket('enemy diconnected', () => {
    console.log('enemy diconnected');
  });

  useEffect(() => {
    return () => {
      sessionSocketEmitter.emit('clear match', currentUserInfo?.id);
    };
  }, [currentUserInfo, sessionSocketEmitter]);

  const onClickAct = () => {
    sessionSocketEmitter.emit('matchmake', currentUserInfo);
  };
  // console.log("ui", currentUserInfo);
  return (
    <Container flexDirection={'column'}>
      <div>
        {isMatched && <Game />}
        {!isMatched && (
          <>
            <button onClick={onClickAct}>button</button>
            <h1> WAITING... </h1>
          </>
        )}
      </div>
    </Container>
  );
};
