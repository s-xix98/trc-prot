import { useAtomValue } from 'jotai';

import { userInfoAtom } from '@/stores/jotai';

export const useCurrentUser = () => {
  const userInfo = useAtomValue(userInfoAtom);

  return { userInfo };
};
