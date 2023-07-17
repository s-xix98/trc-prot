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

  // TODO : 微妙な気がするが、変更箇所多くなるので一旦
  // TODO : めんどうなので friends などが undef の時は [] を返すようにした
  return {
    currentUserInfo: currentUser?.userInfo,
    friends: currentUser?.friends ?? [],
    friendRequests: currentUser?.friendRequests ?? [],
    blockUsers: currentUser?.blockUsers ?? [],
    joinedRooms: currentUser?.joinedRooms ?? [],
  };
};
