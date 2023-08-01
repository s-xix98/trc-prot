import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useSessionSocketEmitter } from '@/hooks/useSocket';

export type CreateDMDto = {
  targetId: string;
};

export const useCreateDM = () => {
  const sessionSocketEmitter = useSessionSocketEmitter();
  const { joinedRooms } = useCurrentUser();

  const isDmAlreadyExist = (targetId: string) => {
    const dm = joinedRooms.find(
      (r) =>
        r.isDM === true && r.roomMembers?.some((r) => r.user.id === targetId),
    );
    return dm !== undefined;
  };

  const emit = (targetId: string) => {
    if (isDmAlreadyExist(targetId)) {
      return;
    }
    const dto: CreateDMDto = {
      targetId: targetId,
    };
    sessionSocketEmitter.emit('createDM', dto);
  };

  return { emit };
};
