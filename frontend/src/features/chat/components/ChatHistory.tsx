import { useLayoutEffect } from 'react';

import { Container } from '@/components/Layout/Container';
import { ContainerItem } from '@/components/Layout/ContainerItem';

import { handleMessageDto } from '../types/MessageDto';

export const ChatHistory = ({
  chatHistMsgs,
  isNeedScroll,
  scrollBottomRef,
}: {
  chatHistMsgs: handleMessageDto[];
  isNeedScroll: boolean;
  scrollBottomRef: React.RefObject<HTMLDivElement>;
}) => {
  useLayoutEffect(() => {
    if (isNeedScroll === true) {
      scrollBottomRef?.current?.scrollIntoView();
    }
  }, [chatHistMsgs]);

  return (
    <Container flexDirection={'column'}>
      <ContainerItem overflowY={'scroll'}>
        {chatHistMsgs.map((msgDto, idx) => (
          <p key={idx} style={{ overflowWrap: 'break-word' }}>
            {`${msgDto.nickname}> ${msgDto.msg}`}
          </p>
        ))}
        <div ref={scrollBottomRef}></div>
      </ContainerItem>
    </Container>
  );
};
