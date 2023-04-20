import { useLayoutEffect } from 'react';

import { Container } from '../../components/Layout/Container';
import { ContainerItem } from '../../components/Layout/ContainerItem';

export const ChatHistory = ({
  chatHistMsgs,
  isNeedScroll,
  scrollBottomRef,
}: {
  chatHistMsgs: string[];
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
        {chatHistMsgs.map((msg, idx) => (
          <p key={idx} style={{ overflowWrap: 'break-word' }}>
            {msg}
          </p>
        ))}
        <div ref={scrollBottomRef}></div>
      </ContainerItem>
    </Container>
  );
};
