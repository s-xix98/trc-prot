import { useEffect, useState } from 'react';

import { useSocket } from '@/hooks/useSocket';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Container } from '@/components/Layout/Container';
import { useSafeEmit } from '@/hooks/useSafeEmit';

import { Game } from './Game';

export const Matching = () => {
  const [isMatched, setMatched] = useState(false);
  const { userInfo } = useCurrentUser();
  const emit = useSafeEmit();

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
      emit('clear match', userInfo?.id);
    };
  }, [userInfo, emit]);

  const onClickAct = () => {
    emit('matchmake', userInfo);
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
