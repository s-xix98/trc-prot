import { useState } from 'react';

import { ContainerItem } from '@/components/Layout/ContainerItem';
import { Container } from '@/components/Layout/Container';
import { useModal } from '@/hooks/useModal';
import { useFriendStatus } from '@/hooks/useCurrentUser';

import { handleMessageDto } from '../types/MessageDto';

import { UserProfileModal } from '../../user/components/UserProfile';
import { UserInfo } from '../../../features/user/types/UserDto';

const ShowChatMsg = ({
  msgDto,
  onClickAct,
}: {
  msgDto: handleMessageDto;
  onClickAct: (UserInfo: UserInfo) => void;
}) => {
  const { isBlockUser } = useFriendStatus();

  return (
    <>
      {isBlockUser(msgDto.user) ? (
        <>
          <i onClick={() => onClickAct(msgDto.user)}>
            --- This is blocked user msg ---
          </i>
          <br />
        </>
      ) : (
        <p
          style={{ overflowWrap: 'break-word' }}
          onClick={() => onClickAct(msgDto.user)}
        >
          {`${msgDto.user.username}> ${msgDto.content}`}
        </p>
      )}
    </>
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

  const onClickAct = (userInfo: UserInfo) => {
    setSelectUser(userInfo);
    openModal();
  };

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
          <ShowChatMsg key={idx} msgDto={msgDto} onClickAct={onClickAct} />
        ))}
        <div ref={scrollBottomRef}></div>
      </ContainerItem>
    </Container>
  );
};
