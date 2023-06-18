import { useSocket } from '@/hooks/useSocket';
import { useState } from 'react';
import { socket } from '@/socket';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export const Matching = () => {
  const [isMatched, setMatched] = useState(false);
  const [name, setName] = useState('');
  const { userInfo } = useCurrentUser();

  useSocket('matched', (side: number, enemyName: string) => {
    console.log(side, enemyName);
    setName(enemyName);
    setMatched(true);
  });
  useSocket('already playing', () => {
    console.log('already playing');
  });
  useSocket('enemy diconnected', () => {
    console.log('enemy diconnected');
  });

  const onClickAct = () => {
    socket.emit('matchmake', userInfo);
  };
  // console.log("ui", userInfo);
  return (
    <>
      <button onClick={onClickAct}>button</button>
      {isMatched && <h1> {name} </h1>}
      {!isMatched && <h1> WAITING... </h1>}
    </>
  );
};
