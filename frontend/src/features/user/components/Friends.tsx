import { useGetFriends } from '../api/getFriends';

export const Friends = () => {
  const { friends } = useGetFriends();

  return (
    <>
      <h1>Friends</h1>
      {friends.map((user, idx) => (
        <p key={idx}>{user.username}</p>
      ))}
    </>
  );
};
