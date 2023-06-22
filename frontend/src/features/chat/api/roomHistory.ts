import { useEffect } from 'react';
import { useState } from 'react';

import { BACKEND } from '@/constants';

import { handleMessageDto } from '../types/MessageDto';

import { useSessionAxios } from '../../../hooks/useSessionAxios';

export const useRoomHistory = (selectedChannelId: string) => {
  const [chatHistMsgs, setChatHistMsgs] = useState<handleMessageDto[]>([]);
  const axios = useSessionAxios();
  useEffect(() => {
    axios
      .get(BACKEND + '/chat/rooms/' + selectedChannelId + '/history')
      .then((res) => {
        setChatHistMsgs(res.data);
      })
      .catch(() => {
        console.log('room 取得失敗');
      });
  }, [selectedChannelId, axios]);

  return { chatHistMsgs, setChatHistMsgs };
};
