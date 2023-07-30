import { Slider } from '@mui/material';
import { useState } from 'react';

import { Container } from '@/components/Layout/Container';
import { ContainerItem } from '@/components/Layout/ContainerItem';
import { UserProfileModal } from '@/features/user/components/UserProfile';
import { UserInfo } from '@/features/user/types/UserDto';
import { useUserProfileModal } from '@/hooks/useUserProfileModal';
import { ModalView } from '@/components/Elements/Modal/ModalView';
import { useModal } from '@/hooks/useModal';
import { useCurrentUser } from '@/hooks/useCurrentUser';

import { chatChannelDto } from '../types/chatChannelDto';
import { useKickRoomMember } from '../api/kickRoomMember';
import { useBanRoomMember } from '../api/banRoomMember';

const BanUserModal = ({
  selectedChannel,
  targetUser,
}: {
  selectedChannel: chatChannelDto;
  targetUser: UserInfo;
}) => {
  const modal = useModal();
  const [value, setValue] = useState<number>(30);
  const banRoomMember = useBanRoomMember();

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  return (
    <>
      {modal.modalIsOpen === false ? (
        <button onClick={() => modal.openModal()}>Ban</button>
      ) : (
        <ModalView {...modal} height="250px" width="200px">
          <h3>Set Ban Time</h3>
          <br />
          <p>{value} minute</p>
          <div style={{ margin: '10px' }}>
            <Slider
              aria-label="Volume"
              value={value}
              onChange={handleChange}
              valueLabelDisplay="auto"
              step={10}
              min={10}
              max={300}
            />
          </div>
          <button
            onClick={() => {
              banRoomMember.emit(selectedChannel.id, targetUser.id, value);
            }}
          >
            Ban
          </button>
        </ModalView>
      )}
    </>
  );
};

const KickUserBtn = ({
  selectedChannel,
  user,
}: {
  selectedChannel: chatChannelDto;
  user: UserInfo;
}) => {
  const KickRoomMember = useKickRoomMember();

  return (
    <>
      <button onClick={() => KickRoomMember.emit(selectedChannel.id, user.id)}>
        Kick
      </button>
    </>
  );
};

export const ShowRoomUser = ({
  user,
  selectedChannel,
  openUserProfileModal,
}: {
  user: UserInfo;
  selectedChannel: chatChannelDto;
  openUserProfileModal: (userInfo: UserInfo) => void;
}) => {
  const { currentUserInfo } = useCurrentUser();

  return (
    <>
      {currentUserInfo?.id === user.id ? (
        <p onClick={() => openUserProfileModal(user)}>{user.username}</p>
      ) : (
        <div>
          <Container>
            <p onClick={() => openUserProfileModal(user)}>{user.username}</p>
            <div style={{ margin: 'auto 10px auto auto' }}>
              <BanUserModal
                selectedChannel={selectedChannel}
                targetUser={user}
              />
              <KickUserBtn selectedChannel={selectedChannel} user={user} />
            </div>
          </Container>
        </div>
      )}
    </>
  );
};

export const ShowChatRoomMembers = ({
  selectedChannel,
  roomMembers,
}: {
  selectedChannel: chatChannelDto;
  roomMembers: UserInfo[];
}) => {
  const { selectingUser, modal, openUserProfileModal } = useUserProfileModal();

  return (
    <>
      <UserProfileModal userInfo={selectingUser} {...modal} />
      <ContainerItem overflowY="scroll">
        {roomMembers.map((user, idx) => (
          <ShowRoomUser
            key={idx}
            user={user}
            selectedChannel={selectedChannel}
            openUserProfileModal={openUserProfileModal}
          />
        ))}
      </ContainerItem>
    </>
  );
};
