import { Avatar, Stack } from '@mui/material';
import FaceRetouchingOffIcon from '@mui/icons-material/FaceRetouchingOff';

import { useCurrentUser } from '@/hooks/useCurrentUser';

import { UserInfo } from '../types/UserDto';
import { useFriendRequestSender } from '../api/friendRequestSender';
import { useBlockRequestSender } from '../api/blockRequestSender';

const ShowIcon = ({ userInfo }: { userInfo: UserInfo }) => {
  return (
    <Stack direction="row" spacing={2}>
      <Avatar sx={{ color: '#33ff33', bgcolor: 'black' }}>
        <FaceRetouchingOffIcon />
      </Avatar>
      <h1>{userInfo.username}</h1>
    </Stack>
  );
};

const MyProfile = ({ userInfo }: { userInfo: UserInfo }) => {
  return (
    <div>
      <ShowIcon userInfo={userInfo} />
      <br />
      <p>this is me</p>
    </div>
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
    <div>
      <ShowIcon userInfo={userInfo} />
      <br />
      <button onClick={sendFriendReq}>Friend Req</button>
      <button onClick={sendBlockReq}>Block Req</button>
    </div>
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
