import { ChangeEvent } from 'react';
import { useState } from 'react';
import { KeyboardEvent } from 'react';

export const useInput = (act: () => void) => {
  const [input, setInput] = useState('');

  const onChangeAct = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '\n') {
      return;
    }
    if (e.target.value.slice(-1) !== '\n') {
      setInput(e.target.value);
      return;
    }

    console.log('onChangeAct');
    act();

    setInput('');
  };

  const onKeyDownAct = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      if (input === '') {
        return;
      }
      console.log('onKeyDownAct');
      act();
      setInput('');
    }
  };

  return { input, setInput, onChangeAct, onKeyDownAct };
};
