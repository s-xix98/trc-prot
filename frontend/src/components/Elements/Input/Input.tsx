import { ChangeEvent } from 'react';

import TextField from '@mui/material/TextField';

export const Input = ({
  msg,
  onChangeAct,
}: {
  msg: string;
  onChangeAct: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <>
      <TextField
        id="outlined-multiline-static"
        multiline
        value={msg}
        onChange={onChangeAct}
        style={{ height: '100%', width: '100%' }}
      />
    </>
  );
};
