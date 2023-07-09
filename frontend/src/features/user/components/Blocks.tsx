import { useGetBlocks } from '../api/getBlocks';
import { UserList } from './UserProfile';

export const Blocks = () => {
  const { blocks } = useGetBlocks();

  return (
    <>
      <h1>Blocks</h1>
      <UserList userList={blocks} />
    </>
  );
};
