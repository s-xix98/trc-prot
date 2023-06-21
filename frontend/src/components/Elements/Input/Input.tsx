import { RefObject } from 'react';
import { ChangeEvent } from 'react';
import TextField from '@mui/material/TextField';

export const Input = ({
  msg,
  onChangeAct,
  placeholder,
  focusRef = undefined,
}: {
  msg?: string;
  onChangeAct: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string | undefined;
  focusRef?: RefObject<HTMLTextAreaElement> | undefined;
}) => {
  return (
    <>
      <TextField
        id="outlined-multiline-static"
        data-testid="input-test-id"
        multiline
        variant="standard"
        placeholder={placeholder}
        autoFocus={true}
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
        inputRef={focusRef}
      />
    </>
  );
};
