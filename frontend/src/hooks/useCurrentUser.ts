import { useAtomValue, useSetAtom } from 'jotai';

import { currentUserAtom } from '@/stores/jotai';

import { useSessionSocket } from './useSocket';

export const useCurrentUserStateUpdates = () => {
  const setCurrentUserAtom = useSetAtom(currentUserAtom);

  useSessionSocket('joinedRooms', (data) => {
    console.log('joinedRooms', data);
    setCurrentUserAtom((prev) =>
      prev ? { ...prev, joinedRooms: data } : prev,
    );
  });

  useSessionSocket('friendRequests', (data) => {
    // friendRequestの処理を書く
    console.log('friendRequests', data);
    setCurrentUserAtom((prev) =>
      prev ? { ...prev, friendRequests: data } : prev,
    );
  });

  useSessionSocket('friends', (data) => {
    console.log('friends', data);
    setCurrentUserAtom((prev) => (prev ? { ...prev, friends: data } : prev));
  });

  useSessionSocket('blockUsers', (data) => {
    console.log('blockUsers', data);
    setCurrentUserAtom((prev) => (prev ? { ...prev, blockUsers: data } : prev));
  });
};

export const useCurrentUser = () => {
  const currentUser = useAtomValue(currentUserAtom);

  return { currentUserInfo: currentUser?.userInfo };
};
