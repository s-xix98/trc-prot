import { useCallback, useEffect } from 'react';
import { useState } from 'react';

import {
  handleMessageDtoArr,
  handleMessageDtoArrSchema,
} from '../types/MessageDto';

import { useCustomAxiosGetter } from '../../../hooks/useSessionAxios';

export const useRoomHistory = (selectedChannelId: string) => {
  const [chatHistMsgs, setChatHistMsgs] = useState<handleMessageDtoArr>([]);
  const { customAxiosGetter } = useCustomAxiosGetter();

  const onSucessCallback = useCallback((chatHistMsgs: handleMessageDtoArr) => {
    setChatHistMsgs(chatHistMsgs);
  }, []);

  useEffect(() => {
    customAxiosGetter(
      { uri: '/chat/rooms/' + selectedChannelId + '/history' },
      handleMessageDtoArrSchema,
      onSucessCallback,
    );
  }, [customAxiosGetter, onSucessCallback, selectedChannelId]);

  return { chatHistMsgs, setChatHistMsgs };
};
