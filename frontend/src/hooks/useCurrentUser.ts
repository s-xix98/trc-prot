import { useAtomValue } from 'jotai';

import { userInfoAtom } from '@/stores/jotai';

export const useCurrentUser = () => {
  const currentUserInfo = useAtomValue(userInfoAtom);

  return { currentUserInfo };
};
