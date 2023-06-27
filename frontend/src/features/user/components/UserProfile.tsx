import { useCurrentUser } from '@/hooks/useCurrentUser';

import { UserInfo } from '../types/UserDto';

const MyProfile = ({ userInfo }: { userInfo: UserInfo }) => {
  return (
    <>
      <h1>My : {userInfo.username}</h1>
    </>
  );
};

const OtherProfile = ({ userInfo }: { userInfo: UserInfo }) => {
  return (
    <>
      <h1>{userInfo.username}</h1>
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
