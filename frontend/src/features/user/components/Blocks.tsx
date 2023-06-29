import { useGetBlocks } from '../api/getBlocks';

export const Blocks = () => {
  const { blocks } = useGetBlocks();

  return (
    <>
      <h1>Blocks</h1>
      {blocks.map((user, idx) => (
        <p key={idx}>{user.username}</p>
      ))}
    </>
  );
};
