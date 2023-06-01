import { useState } from 'react';
import { ChangeEvent } from 'react';

const TerminalInput = ({
  input,
  onChangeAct,
}: {
  input: string;
  onChangeAct: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}) => {
  return (
    <div style={{ display: 'flex' }}>
      <p>&gt;&nbsp;</p>
      <textarea
        style={{
          resize: 'none',
          border: 'none',
          outline: 'none',
          fontSize: 'inherit',
          fontFamily: 'inherit',
        }}
        rows={1}
        autoFocus={true}
        onChange={onChangeAct}
        value={input}
      />
    </div>
  );
};

export const Terminal = () => {
  const [input, setInput] = useState('');
  const [outputArr, setOutputArr] = useState<JSX.Element[]>([]);

  const onChangeAct = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value === '\n') {
      return;
    }
    if (e.target.value.slice(-1) !== '\n') {
      setInput(e.target.value);
      return;
    }

    const inputElem = <p>&gt;&nbsp;{input}</p>;
    setOutputArr([...outputArr, inputElem]);
    setInput('');
  };

  return (
    <div>
      <h1>Terminal</h1>
      {outputArr.map((output) => output)}
      <TerminalInput input={input} onChangeAct={onChangeAct} />
    </div>
  );
};
