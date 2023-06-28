import { useState } from 'react';

import { ContainerItem } from '@/components/Layout/ContainerItem';
import { Container } from '@/components/Layout/Container';
import { useModal } from '@/hooks/useModal';
import { ModalView } from '@/components/Elements/Modal/ModalView';

import { handleMessageDto } from '../types/MessageDto';

import { UserProfile } from '../../user/components/UserProfile';
import { UserInfo } from '../../../features/user/types/UserDto';

// TODO : 横長のメッセージの対応とか必要
// TODO : 長い username の時の考慮も必要かな。
// もう少し UI 整えようかなと思ったり
const ChatMsg = ({
  msgDto,
  onClickAct,
}: {
  msgDto: handleMessageDto;
  onClickAct: (msgDto: handleMessageDto) => void;
}) => {
  return (
    <Container height={'auto'}>
      <ContainerItem flexRatio={1}>
        <p
          onClick={() => {
            onClickAct(msgDto);
          }}
        >
          {`${msgDto.user.username}>`}
        </p>
      </ContainerItem>
      <ContainerItem flexRatio={9}>
        <pre>{msgDto.content}</pre>
      </ContainerItem>
    </Container>
  );
};

export const ChatHistory = ({
  chatHistMsgs,
  scrollBottomRef,
}: {
  chatHistMsgs: handleMessageDto[];
  scrollBottomRef: React.RefObject<HTMLDivElement>;
}) => {
  const [selectUser, setSelectUser] = useState<UserInfo>();
  const { modalIsOpen, openModal, closeModal } = useModal();

  const onClickAct = (msgDto: handleMessageDto) => {
    setSelectUser(() => msgDto.user);
    openModal();
  };

  return (
    <Container flexDirection={'column'}>
      <ContainerItem overflowY={'scroll'}>
        {selectUser && (
          <ModalView
            modalIsOpen={modalIsOpen}
            closeModal={closeModal}
            height="50%"
            width="30%"
          >
            <UserProfile userInfo={selectUser} />
          </ModalView>
        )}
        {chatHistMsgs.map((msgDto, idx) => (
          <ChatMsg key={idx} msgDto={msgDto} onClickAct={onClickAct} />
        ))}
        <div ref={scrollBottomRef}></div>
      </ContainerItem>
    </Container>
  );
};
