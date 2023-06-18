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
        data-testid="input-test-id"
        multiline
        variant="standard"
        placeholder="username"
        sx={{
          '& .MuiInputBase-input': {
            color: '#33ff33', // Text color
            backgroundColor: '#303030', // 背景色
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: '#33ff33', // 通常時のボーダー色
          },
        }}
        value={msg}
        onChange={onChangeAct}
        style={{ width: '100%' }}
      />
    </>
  );
};
