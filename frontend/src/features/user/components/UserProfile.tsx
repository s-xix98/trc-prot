import { Avatar, Stack } from '@mui/material';
import FaceRetouchingOffIcon from '@mui/icons-material/FaceRetouchingOff';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Badge from '@mui/material/Badge';

import { useCurrentUser, useFriendStatus } from '@/hooks/useCurrentUser';
import { ModalView } from '@/components/Elements/Modal/ModalView';
import { useUserProfileModal } from '@/hooks/useUserProfileModal';
import { FormInput } from '@/components/Elements/Input/FormInput';
import { convertToBase64 } from '@/utils/base64';
import { useInviteGame } from '@/features/game/api/inviteGame';

import { UserInfo } from '../types/UserDto';
import { useFriendRequestSender } from '../api/friendRequestSender';
import { useBlockRequestSender } from '../api/blockRequestSender';
import { useUnblockRequestSender } from '../api/unblockRequestSender';
import { UserProfileDtoSchema } from '../types/UpdateProfileDto';
import { useUpdateProfile } from '../api/updateProfile';

const DefalutIcon = () => {
  return (
    <Avatar sx={{ color: '#33ff33', bgcolor: 'black' }}>
      <FaceRetouchingOffIcon />
    </Avatar>
  );
};

// TODO : ここに置くのは微妙だけど、とりあえず
// 500KB?
const MAX_FILE_SIZE = 500000;

const IconStateBadge = ({
  userInfo,
  children,
}: {
  userInfo: UserInfo;
  children: React.ReactNode;
}) => {
  const { friends } = useCurrentUser();

  // クソ処理、フレンドリストにしか、state ないから、フレンドリストから state ひっぱてくる
  const state = friends.find((f) => f.id === userInfo.id)?.state;
  const stateColor = state !== 'OFFLINE' ? '#33ff33' : 'darkgray';

  if (state === undefined) {
    return <>{children}</>;
  }

  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
      sx={{
        '& .MuiBadge-badge': {
          backgroundColor: stateColor,
          color: stateColor,
        },
      }}
    >
      {children}
    </Badge>
  );
};

const ShowIcon = ({ userInfo }: { userInfo: UserInfo }) => {
  return (
    <Stack direction="row" spacing={2}>
      <IconStateBadge userInfo={userInfo}>
        {userInfo.base64Image ? (
          <Avatar src={userInfo.base64Image} />
        ) : (
          <DefalutIcon />
        )}
      </IconStateBadge>
      <h1>{userInfo.username}</h1>
    </Stack>
  );
};

// Form 用の UserProfile Schema
// react hook form で undef だと、未入力とエラーででしまうので null を 許容
const FormUserProfileDtoSchema = z.object({
  username: UserProfileDtoSchema.shape.username.nullable().optional(),
  base64Image: z
    .unknown()
    .optional()
    .transform((files) => (files instanceof FileList ? files : undefined))
    .transform((files) => files?.[0])
    // TODO : for debug
    .refine((file) => {
      console.log('file size is', file?.size);
      return true;
    }, 'are?')
    // true -> OK
    .refine(
      (file) => !file || file?.size <= MAX_FILE_SIZE,
      'file size is too large',
    )
    .transform((file) => (file ? convertToBase64(file) : file))
    .transform((data) => z.string().parse(data))
    .nullable(),
});
type FormUserProfileDto = z.infer<typeof FormUserProfileDtoSchema>;

const MyProfileUpdateForm = () => {
  const { updateProfile } = useUpdateProfile();

  const methods = useForm<FormUserProfileDto>({
    resolver: zodResolver(FormUserProfileDtoSchema),
    defaultValues: {
      username: null,
      base64Image: null,
    },
  });

  const handleUpdateUserProfile: SubmitHandler<FormUserProfileDto> = (data) => {
    console.log(data);
    const username = data.username === null ? undefined : data.username;
    const base64Image =
      data.base64Image === null ? undefined : data.base64Image;
    updateProfile(username, base64Image);
    resetForm();
  };

  const resetForm = () => {
    methods.reset({ username: null, base64Image: null });
  };

  return (
    <>
      <p>Profile Update</p>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleUpdateUserProfile)}>
          <FormInput name="username" placeholder="new username" type="text" />
          <br />
          <br />
          <input
            type="file"
            accept="image/*"
            {...methods.register('base64Image')}
          />
          {methods.formState.errors.base64Image && (
            <p style={{ color: 'red' }}>
              {methods.formState.errors.base64Image.message}
            </p>
          )}
          <br />
          <br />
          <button type="submit">UpdateProfile</button>
          <button type="button" onClick={resetForm}>
            Reset
          </button>
        </form>
      </FormProvider>
    </>
  );
};

// TODO : 名前変更した時に modal の表示名変わるように, あんま良くないので、ちゃんとするかも
const MyProfile = ({ userInfo }: { userInfo: UserInfo }) => {
  const { currentUserInfo } = useCurrentUser();

  return (
    <div>
      <ShowIcon userInfo={currentUserInfo ? currentUserInfo : userInfo} />
      <br />
      <p>this is me</p>
      <br />
      <MyProfileUpdateForm />
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
  const inviteGame = useInviteGame();
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
      {/* TODO : ブロックしてるユーザーにも表示する？ */}
      <br />
      <button onClick={() => inviteGame.emit(userInfo)}>Invite Game</button>
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
      <UserProfileModal userInfo={selectingUser} {...modal} />
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
