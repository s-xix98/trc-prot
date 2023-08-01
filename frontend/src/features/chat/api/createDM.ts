import { useSessionSocketEmitter } from '@/hooks/useSocket';

export type CreateDMDto = {
  targetId: string;
};

export const useCreateDM = () => {
  const sessionSocketEmitter = useSessionSocketEmitter();

  const emit = (targetId: string) => {
    const dto: CreateDMDto = {
      targetId: targetId,
    };
    sessionSocketEmitter.emit('createDM', dto);
  };

  return { emit };
};
