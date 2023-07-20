import { useState } from 'react';

import { UserInfo } from '@/features/user/types/UserDto';

import { useModal } from './useModal';

export const useUserProfileModal = () => {
  const modal = useModal();
  const [selectingUser, setSelectingUser] = useState<UserInfo>();

  const openUserProfileModal = (userInfo: UserInfo) => {
    setSelectingUser(userInfo);
    modal.openModal();
  };

  return { selectingUser, modal, openUserProfileModal };
};
