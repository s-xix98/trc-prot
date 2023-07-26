import { RefObject } from 'react';
import { ChangeEvent } from 'react';
import TextField from '@mui/material/TextField';
import { InputAdornment } from '@mui/material';
import { KeyboardEvent } from 'react';

import { inputSx } from '@/lib/mui';

export const Input = ({
  msg,
  start = undefined,
  startOnClick = undefined,
  onChangeAct,
  onKeyDownAct = undefined,
  placeholder,
  disableUnderline = false,
  focusRef = undefined,
}: {
  msg?: string;
  start?: string;
  startOnClick?: () => void;
  onChangeAct: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDownAct?: (e: KeyboardEvent<HTMLDivElement>) => void;
  placeholder?: string | undefined;
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
        autoFocus={true}
        sx={inputSx}
        InputProps={{
          disableUnderline: disableUnderline,
          startAdornment: start ? (
            <InputAdornment position="start">
              <p style={{ color: '#33ff33' }} onClick={startOnClick}>
                {start}
              </p>
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
