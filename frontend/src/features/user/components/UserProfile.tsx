import { Avatar, Stack } from '@mui/material';
import FaceRetouchingOffIcon from '@mui/icons-material/FaceRetouchingOff';

import { useCurrentUser, useFriendStatus } from '@/hooks/useCurrentUser';
import { ModalView } from '@/components/Elements/Modal/ModalView';
import { useUserProfileModal } from '@/hooks/useUserProfileModal';

import { UserInfo } from '../types/UserDto';
import { useFriendRequestSender } from '../api/friendRequestSender';
import { useBlockRequestSender } from '../api/blockRequestSender';
import { useUnblockRequestSender } from '../api/unblockRequestSender';

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

const FriendUserDetails = ({ sendBlockReq }: { sendBlockReq: () => void }) => {
  return (
    <>
      <p>Friend</p>
      <button onClick={sendBlockReq}>Block Req</button>
    </>
  );
};

const BlockUserDetails = ({
  sendUnBlockReq,
}: {
  sendUnBlockReq: () => void;
}) => {
  return (
    <>
      <p>Blocking</p>
      <button onClick={sendUnBlockReq}>Unblock Req</button>
    </>
  );
};

const OtherUserDetails = ({
  sendFriendReq,
  sendBlockReq,
}: {
  sendFriendReq: () => void;
  sendBlockReq: () => void;
}) => {
  return (
    <>
      <p>Other</p>
      <button onClick={sendFriendReq}>Friend Req</button>
      <button onClick={sendBlockReq}>Block Req</button>
    </>
  );
};

const OtherProfile = ({ userInfo }: { userInfo: UserInfo }) => {
  const friendRequestSender = useFriendRequestSender();
  const blockRequestSender = useBlockRequestSender();
  const unblockRequestSender = useUnblockRequestSender();
  const { isFriend, isBlockUser } = useFriendStatus();

  const sendFriendReq = () => {
    friendRequestSender.emit(userInfo.id);
  };

  const sendBlockReq = () => {
    blockRequestSender.emit(userInfo.id);
  };

  const sendUnBlockReq = () => {
    unblockRequestSender.emit(userInfo.id);
  };

  return (
    <div>
      <ShowIcon userInfo={userInfo} />
      <br />
      {isFriend(userInfo) && <FriendUserDetails sendBlockReq={sendBlockReq} />}
      {isBlockUser(userInfo) && (
        <BlockUserDetails sendUnBlockReq={sendUnBlockReq} />
      )}
      {!isFriend(userInfo) && !isBlockUser(userInfo) && (
        <OtherUserDetails
          sendFriendReq={sendFriendReq}
          sendBlockReq={sendBlockReq}
        />
      )}
    </div>
  );
};

export const UserProfile = ({ userInfo }: { userInfo: UserInfo }) => {
  const { currentUserInfo } = useCurrentUser();

  return (
    <>
      {currentUserInfo?.id === userInfo.id ? (
        <MyProfile userInfo={userInfo} />
      ) : (
        <OtherProfile userInfo={userInfo} />
      )}
    </>
  );
};

export const UserProfileModal = ({
  userInfo,
  modalIsOpen,
  closeModal,
}: {
  userInfo: UserInfo | undefined;
  modalIsOpen: boolean;
  closeModal: () => void;
}) => {
  return (
    <ModalView
      modalIsOpen={modalIsOpen}
      closeModal={closeModal}
      height="50%"
      width="30%"
    >
      {!userInfo && <p>user is not selecting</p>}
      {userInfo && <UserProfile userInfo={userInfo} />}
    </ModalView>
  );
};

export const UserListWithModal = ({ userList }: { userList: UserInfo[] }) => {
  const { selectingUser, modal, openUserProfileModal } = useUserProfileModal();

  return (
    <>
      <UserProfileModal
        userInfo={selectingUser}
        modalIsOpen={modal.modalIsOpen}
        closeModal={modal.closeModal}
      />
      {userList.map((user, idx) => (
        <p
          key={idx}
          onClick={() => {
            openUserProfileModal(user);
          }}
        >
          {user.username}
        </p>
      ))}
    </>
  );
};
