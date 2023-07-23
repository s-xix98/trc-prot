import { useSessionSocketEmitter } from '@/hooks/useSocket';

import { UserProfileDto } from '../types/UpdateProfileDto';

export const useUpdateProfile = () => {
  const sessionSocketEmitter = useSessionSocketEmitter();

  const updateProfile = (username?: string, base64Image?: string) => {
    if (username === undefined && base64Image === undefined) {
      return;
    }
    const dto: UserProfileDto = {
      username: username,
      base64Image: base64Image,
    };
    sessionSocketEmitter.emit('updateProfile', dto);
  };

  return { updateProfile };
};
