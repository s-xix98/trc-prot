import { useSessionSocketEmitter } from '@/hooks/useSocket';

import { UpdateChatRoomDto } from '../types/UpdateChatRoomDto';

export const useUpdateChatRoom = () => {
  const sessionSocketEmitter = useSessionSocketEmitter();

  const updateChatRoom = (dto: UpdateChatRoomDto) => {
    sessionSocketEmitter.emit('updateChatRoom', dto);
  };

  const updateChatRoomName = (chatRoomId: string, newRoomName: string) => {
    const dto: UpdateChatRoomDto = {
      chatRoomId: chatRoomId,
      roomName: newRoomName,
    };
    updateChatRoom(dto);
  };

  const updatePassword = (chatRoomId: string, newPassword: string) => {
    const dto: UpdateChatRoomDto = {
      chatRoomId: chatRoomId,
      password: newPassword,
    };
    updateChatRoom(dto);
  };

  const unsetPassword = (chatRoomId: string) => {
    const dto: UpdateChatRoomDto = {
      chatRoomId: chatRoomId,
      password: null,
    };
    updateChatRoom(dto);
  };

  const setIsPrivate = (chatRoomId: string, isPrivate: boolean) => {
    const dto: UpdateChatRoomDto = {
      chatRoomId: chatRoomId,
      isPrivate: isPrivate,
    };
    updateChatRoom(dto);
  };

  return { updateChatRoomName, updatePassword, unsetPassword, setIsPrivate };
};
