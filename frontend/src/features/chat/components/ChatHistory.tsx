import { useState } from 'react';

import { ContainerItem } from '@/components/Layout/ContainerItem';
import { Container } from '@/components/Layout/Container';
import { useModal } from '@/hooks/useModal';
import { ModalView } from '@/components/Elements/Modal/ModalView';

import { handleMessageDto } from '../types/MessageDto';

import { UserProfile } from '../../user/components/UserProfile';
import { UserInfo } from '../../../features/user/types/UserDto';

export const ChatHistory = ({
  chatHistMsgs,
  scrollBottomRef,
}: {
  chatHistMsgs: handleMessageDto[];
  scrollBottomRef: React.RefObject<HTMLDivElement>;
}) => {
  const [selectUser, setSelectUser] = useState<UserInfo>();
  const { modalIsOpen, openModal, closeModal } = useModal();

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
          <div key={idx}>
            <Container>
              <ContainerItem flexRatio={1}>
                <p
                  onClick={() => {
                    setSelectUser(() => msgDto.user);
                    openModal();
                  }}
                >
                  {`${msgDto.user.username}>`}
                </p>
              </ContainerItem>
              <ContainerItem flexRatio={9}>
                <pre>{msgDto.content}</pre>
              </ContainerItem>
            </Container>
          </div>
        ))}
        <div ref={scrollBottomRef}></div>
      </ContainerItem>
    </Container>
  );
};
