import { useCurrentUser } from '@/hooks/useCurrentUser';

export const useRoomMembers = (channelId: string) => {
  const { joinedRooms } = useCurrentUser();

  return {
    roomMembers: joinedRooms.find((r) => r.id === channelId)?.roomMembers ?? [],
  };
};

export const useIsChannelOwnerOrAdmin = (channelId: string) => {
  const { roomMembers } = useRoomMembers(channelId);
  const { currentUserInfo } = useCurrentUser();

  const isChannelOwnerOrAdmin = () => {
    const myRoomInfo = roomMembers.find(
      (r) => r.user.id === currentUserInfo?.id,
    );
    return myRoomInfo?.role === 'OWNER' || myRoomInfo?.role === 'ADMIN';
  };

  return { isChannelOwnerOrAdmin };
};
