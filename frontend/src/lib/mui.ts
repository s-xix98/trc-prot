import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#33ff33',
    },
  },
});

export const inputSx = {
  '& .MuiInputBase-input': {
    color: '#33ff33', // Text color
    // backgroundColor: '#303030', // 背景色
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#33ff33', // 通常時のボーダー色
  },
};
