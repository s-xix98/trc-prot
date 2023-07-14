import { useState } from 'react';

import { ContainerItem } from '@/components/Layout/ContainerItem';
import { Container } from '@/components/Layout/Container';
import { useModal } from '@/hooks/useModal';

import { handleMessageDto } from '../types/MessageDto';

import { UserProfileModal } from '../../user/components/UserProfile';
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
          <UserProfileModal
            userInfo={selectUser}
            modalIsOpen={modalIsOpen}
            closeModal={closeModal}
          />
        )}
        {chatHistMsgs.map((msgDto, idx) => (
          <p
            key={idx}
            style={{ overflowWrap: 'break-word' }}
            onClick={() => {
              setSelectUser(() => msgDto.user);
              openModal();
            }}
          >
            {`${msgDto.user.username}> ${msgDto.content}`}
          </p>
        ))}
        <div ref={scrollBottomRef}></div>
      </ContainerItem>
    </Container>
  );
};
