import { Container } from '@/components/Layout/Container';
import { ContainerItem } from '@/components/Layout/ContainerItem';

import { handleMessageDto } from '../types/MessageDto';

export const ChatHistory = ({
  chatHistMsgs,
  scrollBottomRef,
}: {
  chatHistMsgs: handleMessageDto[];
  scrollBottomRef: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <Container flexDirection={'column'}>
      <ContainerItem overflowY={'scroll'}>
        {chatHistMsgs.map((msgDto, idx) => (
          <p key={idx} style={{ overflowWrap: 'break-word' }}>
            {`${msgDto.user.username}> ${msgDto.content}`}
          </p>
        ))}
        <div ref={scrollBottomRef}></div>
      </ContainerItem>
    </Container>
  );
};
