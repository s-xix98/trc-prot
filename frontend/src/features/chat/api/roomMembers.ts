import { useEffect, useState } from 'react';

import { useSessionAxios } from '@/hooks/useSessionAxios';
import { UserInfo } from '@/features/user/types/UserDto';

export const useRoomMembers = (channelId: string) => {
  const [roomMembers, setRoomMembers] = useState<UserInfo[]>([]);
  const axios = useSessionAxios();

  useEffect(() => {
    console.log(`/chat/rooms/${channelId}/members`);
    axios
      .get(`/chat/rooms/${channelId}/members`)
      .then((r) => {
        setRoomMembers(r.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [axios, channelId]);

  return { roomMembers };
};
