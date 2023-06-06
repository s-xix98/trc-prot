import styled from 'styled-components';

export const ContainerItem = styled.div<{
  display?: 'inline' | 'flex';
  flexRatio?: number;
  overflowX?: 'hidden' | 'scroll';
  overflowY?: 'hidden' | 'scroll';
}>`
  display: ${({ display }) => (display ? display : 'inline')};
  flex: ${({ flexRatio }) => (flexRatio ? flexRatio : 1)};
  overflow-x: ${({ overflowX }) => (overflowX ? overflowX : 'hidden')};
  overflow-y: ${({ overflowY }) => (overflowY ? overflowY : 'hidden')};
`;
