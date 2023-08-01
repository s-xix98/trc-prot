type UpdateRoomMemberRoleDto = {
  role: 'ADMIN' | 'USER';
  chatRoomId: string;
  targetId: string;
};

import { useSessionSocketEmitter } from '@/hooks/useSocket';
export const useUpdateChatRoomMemberRole = () => {
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (
    role: 'ADMIN' | 'USER',
    chatRoomId: string,
    targetId: string,
  ) => {
    const dto: UpdateRoomMemberRoleDto = {
      role: role,
      chatRoomId: chatRoomId,
      targetId: targetId,
    };
    sessionSocketEmitter.emit('updateChatRoomMemberRole', dto);
  };

  return { emit };
};
