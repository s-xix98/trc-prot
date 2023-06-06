import { Container } from '@/components/Layout/Container';
import { ContainerItem } from '@/components/Layout/ContainerItem';

export const TerminalOutput = ({
  outputArr,
  scrollBottomRef,
}: {
  outputArr: JSX.Element[];
  scrollBottomRef: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <Container flexDirection={'column'}>
      <ContainerItem overflowY="scroll">
        {outputArr.map((output, idx) => (
          <ContainerItem key={idx}>{output}</ContainerItem>
        ))}
        <div ref={scrollBottomRef} />
      </ContainerItem>
    </Container>
  );
};
