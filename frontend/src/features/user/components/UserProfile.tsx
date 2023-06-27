import { useCurrentUser } from '@/hooks/useCurrentUser';

import { UserInfo } from '../types/UserDto';
import { useFriendRequestSender } from '../api/friendRequestSender';
import { useBlockRequestSender } from '../api/blockRequestSender';

const MyProfile = ({ userInfo }: { userInfo: UserInfo }) => {
  return (
    <>
      <h1>My : {userInfo.username}</h1>
    </>
  );
};

const OtherProfile = ({ userInfo }: { userInfo: UserInfo }) => {
  const friendRequestSender = useFriendRequestSender();
  const blockRequestSender = useBlockRequestSender();

  const sendFriendReq = () => {
    friendRequestSender.emit(userInfo.id);
  };

  const sendBlockReq = () => {
    blockRequestSender.emit(userInfo.id);
  };

  return (
    <>
      <h1>{userInfo.username}</h1>
      <button onClick={sendFriendReq}>Friend Req</button>
      <button onClick={sendBlockReq}>Block Req</button>
    </>
  );
};

export const UserProfile = ({ userInfo }: { userInfo: UserInfo }) => {
  const currentUser = useCurrentUser();

  return (
    <>
      {currentUser.userInfo?.id === userInfo.id ? (
        <MyProfile userInfo={userInfo} />
      ) : (
        <OtherProfile userInfo={userInfo} />
      )}
    </>
  );
};
