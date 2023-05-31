import styled from 'styled-components';

export const Container = styled.div<{ flexDirection?: 'row' | 'column' }>`
  flex: 1;
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection};
  overflow: hidden;
  height: 100%;
  justify-content: center;
`;
