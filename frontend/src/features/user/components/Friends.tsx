import { useCurrentUser } from '@/hooks/useCurrentUser';

import { UserListWithModal } from './UserProfile';

export const Friends = () => {
  const { friends } = useCurrentUser();

  return (
    <>
      <h1>Friends</h1>
      <UserListWithModal userList={friends} />
    </>
  );
};
