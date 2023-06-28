import styled from 'styled-components';

export const Container = styled.div<{
  flexDirection?: 'row' | 'column';
  height?: number | 'auto';
}>`
  flex: 1;
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection};
  overflow: hidden;
  height: ${({ height }) => (height ? height : '100%')};
  justify-content: center;
`;
