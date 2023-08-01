import { useCurrentUser } from '@/hooks/useCurrentUser';

export const useRoomMembers = (channelId: string) => {
  const { joinedRooms } = useCurrentUser();

  return {
    roomMembers: joinedRooms.find((r) => r.id === channelId)?.roomMembers ?? [],
  };
};
