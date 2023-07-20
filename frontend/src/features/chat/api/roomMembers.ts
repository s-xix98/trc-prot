import { useCallback, useEffect, useState } from 'react';

import { useCustomAxiosGetter } from '@/hooks/useSessionAxios';
import { UserInfoArr, UserInfoArrSchema } from '@/features/user/types/UserDto';

export const useRoomMembers = (channelId: string) => {
  const [roomMembers, setRoomMembers] = useState<UserInfoArr>([]);
  const { customAxiosGetter } = useCustomAxiosGetter();

  const onSucessCallback = useCallback((roomMembers: UserInfoArr) => {
    setRoomMembers(roomMembers);
  }, []);

  useEffect(() => {
    customAxiosGetter(
      { uri: `/chat/rooms/${channelId}/members` },
      UserInfoArrSchema,
      onSucessCallback,
    );
  }, [customAxiosGetter, onSucessCallback, channelId]);

  return { roomMembers };
};
