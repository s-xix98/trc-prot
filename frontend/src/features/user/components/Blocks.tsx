import { useGetBlocks } from '../api/getBlocks';

import { UserListWithModal } from './UserProfile';

export const Blocks = () => {
  const { blocks } = useGetBlocks();

  return (
    <>
      <h1>Blocks</h1>
      <UserListWithModal userList={blocks} />
    </>
  );
};
