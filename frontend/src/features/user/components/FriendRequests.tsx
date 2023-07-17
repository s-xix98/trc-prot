import { useCurrentUser } from '@/hooks/useCurrentUser';

import { UserListWithModal } from './UserProfile';

export const FriendRequests = () => {
  const { friendRequests } = useCurrentUser();

  return (
    <>
      <h1>FriendRequests</h1>
      <UserListWithModal userList={friendRequests} />
    </>
  );
};
