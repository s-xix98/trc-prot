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
        data-testid="terminal-input-test-id"
        style={{
          resize: 'none',
          border: 'none',
          outline: 'none',
          fontSize: 'inherit',
          fontFamily: 'inherit',
          color: '#33ff33',
          // TODO : 背景色と同色だと、見づらいのでいったんちょっと違う色に
          backgroundColor: '#303030',
        }}
        rows={1}
        autoFocus={true}
        onChange={onChangeAct}
        value={input}
      />
    </div>
  );
};
