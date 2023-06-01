import { ChangeEvent } from 'react';

export const TerminalInput = ({
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
