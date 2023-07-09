import { useGetFriends } from '../api/getFriends';

import { UserList } from './UserProfile';

export const Friends = () => {
  const { friends } = useGetFriends();

  return (
    <>
      <h1>Friends</h1>
      <UserList userList={friends} />
    </>
  );
};
