import { ReactNode } from 'react';
import Button from '@mui/material/Button';

export const BasicButton = ({
  btnAct,
  children,
}: {
  btnAct: () => void;
  children: ReactNode;
}) => {
  return (
    <Button size={'small'} onClick={btnAct}>
      {children}
    </Button>
  );
};
