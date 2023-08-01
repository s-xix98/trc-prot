import { useEffect } from 'react';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Container } from '@/components/Layout/Container';
import { useSessionSocketEmitter, useSessionSocket } from '@/hooks/useSocket';

export const Matching = () => {
  const { currentUserInfo } = useCurrentUser();
  const sessionSocketEmitter = useSessionSocketEmitter();

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
        <>
          <button onClick={onClickAct}>matchmake</button>
          <h1> WAITING... </h1>
        </>
      </div>
    </Container>
  );
};
