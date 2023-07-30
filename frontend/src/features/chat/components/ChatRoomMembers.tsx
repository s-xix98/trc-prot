import { Container } from '@/components/Layout/Container';
import { ContainerItem } from '@/components/Layout/ContainerItem';
import { UserProfileModal } from '@/features/user/components/UserProfile';
import { UserInfo } from '@/features/user/types/UserDto';
import { useUserProfileModal } from '@/hooks/useUserProfileModal';

import { chatChannelDto } from '../types/chatChannelDto';
import { useKickRoomMember } from '../api/kickRoomMember';

export const ShowChatRoomMembers = ({
  selectedChannel,
  roomMembers,
}: {
  selectedChannel: chatChannelDto;
  roomMembers: UserInfo[];
}) => {
  const { selectingUser, modal, openUserProfileModal } = useUserProfileModal();
  const KickRoomMember = useKickRoomMember();

  return (
    <>
      <UserProfileModal userInfo={selectingUser} {...modal} />
      <ContainerItem overflowY="scroll">
        {roomMembers.map((user, idx) => (
          <div key={idx}>
            <Container>
              <p onClick={() => openUserProfileModal(user)}>{user.username}</p>
              <div style={{ margin: 'auto 10px auto auto' }}>
                <button
                  onClick={() =>
                    KickRoomMember.emit(selectedChannel.id, user.id)
                  }
                >
                  Kick
                </button>
              </div>
            </Container>
          </div>
        ))}
      </ContainerItem>
    </>
  );
};
