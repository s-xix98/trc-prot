import { ReactNode } from 'react';

export const Container = ({
  children,
  flexDirection = 'row',
}: {
  children: ReactNode;
  flexDirection?: 'row' | 'column';
}) => {
  return (
    <div
      style={{
        flex: '1',
        display: 'flex',
        flexDirection: flexDirection,
        overflow: 'hidden',
        height: '100%',
      }}
    >
      {children}
    </div>
  );
};
