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

import { chatChannelDto, roomMember } from '../types/chatChannelDto';
import { useKickRoomMember } from '../api/kickRoomMember';
import { useBanRoomMember } from '../api/banRoomMember';
import { useMuteRoomMember } from '../api/muteRoomMember';
import { useUpdateChatRoomMemberRole } from '../api/updateChatRoomMemberRole';

const SliderModal = ({
  title,
  btnText,
  onClickAct,
  defaultVal,
  stepVal,
  minVal,
  maxVal,
}: {
  title: string;
  btnText: string;
  onClickAct: (value: number) => void;
  defaultVal: number;
  stepVal: number;
  minVal: number;
  maxVal: number;
}) => {
  const modal = useModal();
  const [value, setValue] = useState<number>(defaultVal);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  return (
    <>
      {modal.modalIsOpen === false ? (
        <button onClick={() => modal.openModal()}>{btnText}</button>
      ) : (
        <ModalView {...modal} height="250px" width="200px">
          <h3>{title}</h3>
          <br />
          <p>{value} minute</p>
          <div style={{ margin: '10px' }}>
            <Slider
              aria-label="Volume"
              value={value}
              onChange={handleChange}
              valueLabelDisplay="auto"
              step={stepVal}
              min={minVal}
              max={maxVal}
            />
          </div>
          <button onClick={() => onClickAct(value)}>{btnText}</button>
        </ModalView>
      )}
    </>
  );
};

const BanUserModal = ({
  selectedChannel,
  targetUser,
}: {
  selectedChannel: chatChannelDto;
  targetUser: UserInfo;
}) => {
  const banRoomMember = useBanRoomMember();

  const onClickAct = (value: number) => {
    banRoomMember.emit(selectedChannel.id, targetUser.id, value);
  };

  return (
    <>
      <SliderModal
        title="Set Ban Time"
        btnText="Ban"
        onClickAct={onClickAct}
        defaultVal={30}
        stepVal={10}
        minVal={10}
        maxVal={300}
      />
    </>
  );
};

const MuteUserModal = ({
  selectedChannel,
  targetUser,
}: {
  selectedChannel: chatChannelDto;
  targetUser: UserInfo;
}) => {
  const muteRoomMember = useMuteRoomMember();

  const onClickAct = (value: number) => {
    muteRoomMember.emit(selectedChannel.id, targetUser.id, value);
  };

  return (
    <>
      <SliderModal
        title="Set Mute Time"
        btnText="Mute"
        onClickAct={onClickAct}
        defaultVal={30}
        stepVal={10}
        minVal={10}
        maxVal={300}
      />
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

const SetAdminBtn = ({
  selectedChannel,
  targetUser,
}: {
  selectedChannel: chatChannelDto;
  targetUser: UserInfo;
}) => {
  const updateChatRoomMemberRole = useUpdateChatRoomMemberRole();

  return (
    <>
      <button
        onClick={() =>
          updateChatRoomMemberRole.emit(
            'ADMIN',
            selectedChannel.id,
            targetUser.id,
          )
        }
      >
        Set to Admin
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
        <div>
          <p onClick={() => openUserProfileModal(user)}>{user.username}</p>
          <br />
        </div>
      ) : (
        <div>
          <p onClick={() => openUserProfileModal(user)}>{user.username}</p>
          <div>
            <SetAdminBtn selectedChannel={selectedChannel} targetUser={user} />
            <BanUserModal selectedChannel={selectedChannel} targetUser={user} />
            <MuteUserModal
              selectedChannel={selectedChannel}
              targetUser={user}
            />
            <KickUserBtn selectedChannel={selectedChannel} user={user} />
          </div>
          <br />
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
  roomMembers: roomMember[];
}) => {
  const { selectingUser, modal, openUserProfileModal } = useUserProfileModal();

  return (
    <>
      <UserProfileModal userInfo={selectingUser} {...modal} />
      <ContainerItem overflowY="scroll">
        {roomMembers.map((roomMember, idx) => (
          <ShowRoomUser
            key={idx}
            user={roomMember.user}
            selectedChannel={selectedChannel}
            openUserProfileModal={openUserProfileModal}
          />
        ))}
      </ContainerItem>
    </>
  );
};
