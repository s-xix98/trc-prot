import { RefObject } from 'react';
import { ChangeEvent } from 'react';
import TextField from '@mui/material/TextField';
import { InputAdornment } from '@mui/material';
import { KeyboardEvent } from 'react';

export const Input = ({
  msg,
  start = undefined,
  onChangeAct,
  onKeyDownAct = undefined,
  placeholder,
  disableUnderline = false,
  focusRef = undefined,
  maxRows = 1,
}: {
  msg?: string;
  start?: string;
  onChangeAct: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDownAct?: (e: KeyboardEvent<HTMLDivElement>) => void | undefined;
  placeholder?: string | undefined;
  maxRows?: number;
  disableUnderline?: boolean;
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
        maxRows={maxRows}
        autoFocus={true}
        sx={{
          '& .MuiInputBase-input': {
            color: '#33ff33', // Text color
            // backgroundColor: '#303030', // 背景色
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: '#33ff33', // 通常時のボーダー色
          },
        }}
        InputProps={{
          disableUnderline: disableUnderline,
          startAdornment: start ? (
            <InputAdornment position="start">
              <p style={{ color: '#33ff33' }}>{start}</p>
            </InputAdornment>
          ) : undefined,
          style: {
            fontFamily: 'Courier New',
          },
        }}
        value={msg}
        onChange={onChangeAct}
        onKeyDown={onKeyDownAct}
        style={{ width: '100%' }}
        inputRef={focusRef}
      />
    </>
  );
};
