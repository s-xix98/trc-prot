import { useGetFriends } from '../api/getFriends';

import { UserListWithModal } from './UserProfile';

export const Friends = () => {
  const { friends } = useGetFriends();

  return (
    <>
      <h1>Friends</h1>
      <UserListWithModal userList={friends} />
    </>
  );
};
