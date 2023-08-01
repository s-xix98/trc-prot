import { useEffect, useState } from 'react';

import { UserInfo } from '@/features/user/types/UserDto';
import { useCurrentUser } from '@/hooks/useCurrentUser';

import { useCreateDM } from '../api/createDM';
import { chatChannelDto } from '../types/chatChannelDto';

import { ChatTalkArea } from './ChatTalkArea';

export const DM = ({ targetUserInfo }: { targetUserInfo: UserInfo }) => {
  const [dm, setDM] = useState<chatChannelDto>();
  const createDM = useCreateDM();
  const { joinedRooms } = useCurrentUser();

  useEffect(() => {
    const dm = joinedRooms.find(
      (r) =>
        r.isDM === true &&
        r.roomMembers?.some((r) => r.user.id === targetUserInfo.id),
    );
    if (dm === undefined) {
      createDM.emit(targetUserInfo.id);
      return;
    }
    setDM(dm);
  }, [targetUserInfo, joinedRooms, createDM]);

  return (
    <>
      <h3>DM</h3>
      {dm && <ChatTalkArea selectedChannel={dm} />}
    </>
  );
};
