import { useAtomValue } from 'jotai';

import { currentUserAtom } from '@/stores/jotai';

export const useCurrentUser = () => {
  const currentUser = useAtomValue(currentUserAtom);

  return { currentUserInfo: currentUser?.userInfo };
};
