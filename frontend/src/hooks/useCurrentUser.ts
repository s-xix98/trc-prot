import { useAtomValue, useSetAtom } from 'jotai';

import { currentUserAtom } from '@/stores/jotai';
import { UserInfo } from '@/features/user/types/UserDto';
import { chatChannelDto } from '@/features/chat/types/chatChannelDto';

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

  useSessionSocket('receiveInviteChatRoom', (data) => {
    console.log('receive invite sitayo', data);
    setCurrentUserAtom((prev) =>
      prev ? { ...prev, receiveInviteChatRooms: data } : prev,
    );
  });

  useSessionSocket('profile', (data) => {
    console.log('profile', data);
    setCurrentUserAtom((prev) => (prev ? { ...prev, userInfo: data } : prev));
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
    receiveInviteChatRooms: currentUser?.receiveInviteChatRooms ?? [],
  };
};

const containsUser = (users: UserInfo[], target: UserInfo) => {
  for (const user of users) {
    if (user.id === target.id) {
      return true;
    }
  }
  return false;
};

export const useFriendStatus = () => {
  const { friends, friendRequests, blockUsers } = useCurrentUser();

  const isFriend = (targetUserInfo: UserInfo) => {
    return containsUser(friends, targetUserInfo);
  };

  const isFriendRequest = (targetUserInfo: UserInfo) => {
    return containsUser(friendRequests, targetUserInfo);
  };

  const isBlockUser = (targetUserInfo: UserInfo) => {
    return containsUser(blockUsers, targetUserInfo);
  };

  return { isFriend, isFriendRequest, isBlockUser };
};

export const useChatRoomStatus = () => {
  const { joinedRooms, receiveInviteChatRooms } = useCurrentUser();

  const isJoinedRoom = (room: chatChannelDto) => {
    return joinedRooms.some((r) => r.id === room.id);
  };

  const isInvitedRoom = (room: chatChannelDto) => {
    return receiveInviteChatRooms.some((r) => r.chatRoom.id === room.id);
  };

  return { isJoinedRoom, isInvitedRoom };
};
