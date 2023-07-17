import { useCurrentUser } from '@/hooks/useCurrentUser';

import { UserListWithModal } from './UserProfile';

export const Blocks = () => {
  const { blockUsers } = useCurrentUser();

  return (
    <>
      <h1>Blocks</h1>
      <UserListWithModal userList={blockUsers} />
    </>
  );
};
