import { ContainerItem } from '@/components/Layout/ContainerItem';
import { UserProfileModal } from '@/features/user/components/UserProfile';
import { UserInfo } from '@/features/user/types/UserDto';
import { useUserProfileModal } from '@/hooks/useUserProfileModal';

export const ShowChatRoomMembers = ({
  roomMembers,
}: {
  roomMembers: UserInfo[];
}) => {
  const { selectingUser, modal, openUserProfileModal } = useUserProfileModal();

  return (
    <>
      <UserProfileModal userInfo={selectingUser} {...modal} />
      <ContainerItem overflowY="scroll">
        {roomMembers.map((user, idx) => (
          <p key={idx} onClick={() => openUserProfileModal(user)}>
            {user.username}
          </p>
        ))}
      </ContainerItem>
    </>
  );
};
