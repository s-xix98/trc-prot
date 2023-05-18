import { ChangeEvent, useEffect, useState } from 'react';

export const TerminalInput = ({
  input,
  onChangeAct,
}: {
  input: string;
  onChangeAct: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}) => {
  return (
    <>
      <div style={{ display: 'flex' }}>
        <p>&gt;&nbsp;</p>
        <textarea
          style={{
            resize: 'none',
            caretColor: 'red',
            border: 'none',
            outline: 'none',
            fontSize: 'inherit',
            fontFamily: 'inherit',
            color: 'green',
          }}
          rows={1}
          autoFocus={true}
          onChange={onChangeAct}
          value={input}
        ></textarea>
      </div>
    </>
  );
};

export const NotFound = () => {
  return (
    <>
      <p>NotFound</p>
    </>
  );
};

const One = () => {
  const [val, setVal] = useState('');

  useEffect(() => {
    setVal('hoge');
  }, []);

  return (
    <>
      <h1>hoge</h1>
      <p>{val}</p>
    </>
  );
};

const Two = () => {
  return <One />;
};

export const Terminal = () => {
  const [input, setInput] = useState('');
  const [histArr, setHist] = useState<JSX.Element[]>([]);

  const actMap = new Map<string, () => JSX.Element>();

  actMap.set('one', One);
  actMap.set('two', Two);

  const onChangeAct = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value === '\n') {
      return;
    }
    if (e.target.value.slice(-1) !== '\n') {
      setInput(e.target.value);
      return;
    }

    const inputElem = <p style={{ color: 'green' }}>&gt;&nbsp;{input}</p>;

    const cmdFunc = actMap.get(input);
    if (cmdFunc === undefined) {
      const notFoundElem = <p style={{ color: 'green' }}>NotFound</p>;
      setHist([...histArr, inputElem, notFoundElem]);
    } else {
      const funcRetElem = cmdFunc();
      setHist([...histArr, inputElem, funcRetElem]);
    }
    setInput('');
  };

  return (
    <>
      <div style={{ padding: '5px' }}>
        <h1>Terminal</h1>
        {histArr.map((val) => val)}
        <TerminalInput input={input} onChangeAct={onChangeAct} />
      </div>
    </>
  );
};
