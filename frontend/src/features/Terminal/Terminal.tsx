import { useState } from 'react';
import { ChangeEvent } from 'react';
import { Container } from '@/components/Layout/Container';
import { ContainerItem } from '@/components/Layout/ContainerItem';

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

export const Terminal = ({
  commandElemMap,
}: {
  commandElemMap: Map<string, JSX.Element>;
}) => {
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

    const commandElem = commandElemMap.get(input);

    if (commandElem) {
      setOutputArr([...outputArr, inputElem, commandElem]);
    } else {
      const notFoundElem = <p>NotFound</p>;
      setOutputArr([...outputArr, inputElem, notFoundElem]);
    }

    setInput('');
  };

  return (
    <Container flexDirection="column">
      <h1>Terminal</h1>
      <ContainerItem overflowY="scroll">
        {outputArr.map((output) => output)}
      </ContainerItem>
      <TerminalInput input={input} onChangeAct={onChangeAct} />
    </Container>
  );
};
