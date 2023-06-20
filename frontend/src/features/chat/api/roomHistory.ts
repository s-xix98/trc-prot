import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';

import { BACKEND } from '@/constants';

import { handleMessageDto } from '../types/MessageDto';

export const useRoomHistory = (selectedChannelId: string) => {
  const [chatHistMsgs, setChatHistMsgs] = useState<handleMessageDto[]>([]);

  useEffect(() => {
    axios
      .get(BACKEND + '/chat/rooms/' + selectedChannelId + '/history')
      .then((res) => {
        setChatHistMsgs(res.data);
      })
      .catch(() => {
        console.log('room 取得失敗');
      });
  }, [selectedChannelId]);

  return { chatHistMsgs, setChatHistMsgs };
};
