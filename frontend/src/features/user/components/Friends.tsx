import { useCurrentUser } from '@/hooks/useCurrentUser';

import { UserProfileModal } from './UserProfile';
import { useUserProfileModal } from '@/hooks/useUserProfileModal';

export const Friends = () => {
  const { friends } = useCurrentUser();
  const { selectingUser, modal, openUserProfileModal } = useUserProfileModal();

  return (
    <>
      <h1>Friends</h1>
      <UserProfileModal userInfo={selectingUser} {...modal} />
      {friends.map((user, idx) => (
        <p
          key={idx}
          onClick={() => {
            openUserProfileModal(user);
          }}
        >
          {user.username} {user.state}
        </p>
      ))}
    </>
  );
};
