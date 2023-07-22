import { ChangeEvent } from 'react';

import { Container } from '@/components/Layout/Container';
import { ContainerItem } from '@/components/Layout/ContainerItem';
import { Input } from '@/components/Elements/Input/Input';
import { useFocus } from '@/hooks/useFocus';
import { useSearch } from '@/hooks/useSearch';
import { UserInfo, UserInfoSchema } from '@/features/user/types/UserDto';
import { useUserProfileModal } from '@/hooks/useUserProfileModal';
import { UserProfileModal } from '@/features/user/components/UserProfile';

import { useInviteChannel } from '../api/inviteChannel';
import { chatChannelDto } from '../types/chatChannelDto';

const InviteUser = ({
  userInfo,
  openUserProfileModal,
  sendInvite,
}: {
  userInfo: UserInfo;
  openUserProfileModal: (userInfo: UserInfo) => void;
  sendInvite: (userInfo: UserInfo) => void;
}) => {
  return (
    <div>
      <Container>
        <p onClick={() => openUserProfileModal(userInfo)}>
          {userInfo.username}
        </p>
        <div style={{ margin: 'auto 10px auto auto' }}>
          <button onClick={() => sendInvite(userInfo)}>Invite</button>
        </div>
      </Container>
    </div>
  );
};

// TODO : 参加中のユーザーも表示されちゃうかも？
export const ChannelInvite = ({
  selectedChannel,
}: {
  selectedChannel: chatChannelDto;
}) => {
  const { selectingUser, modal, openUserProfileModal } = useUserProfileModal();
  const { focusRef } = useFocus();
  const { searchedList, searcher } = useSearch<UserInfo>(UserInfoSchema);
  const inviteChannel = useInviteChannel();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    searcher('/user/search', e.target.value);
  };

  const sendInvite = (userInfo: UserInfo) => {
    inviteChannel.emit(selectedChannel.id, userInfo.id);
  };

  return (
    <Container flexDirection="column">
      <h3>Invite</h3>
      <hr />
      <br />
      <UserProfileModal userInfo={selectingUser} {...modal} />
      <ContainerItem overflowY="scroll">
        {searchedList.map((userInfo, idx) => (
          <InviteUser
            key={idx}
            userInfo={userInfo}
            openUserProfileModal={openUserProfileModal}
            sendInvite={sendInvite}
          />
        ))}
      </ContainerItem>
      <Input
        focusRef={focusRef}
        onChangeAct={onChange}
        placeholder={'username'}
      />
    </Container>
  );
};
