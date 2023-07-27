'use client';

import { useAtom } from 'jotai';

import { Container } from '@/components/Layout/Container';
import { ContainerItem } from '@/components/Layout/ContainerItem';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { selectedChannelAtom } from '@/stores/chatState';

import { ChatChannelArea } from './ChatChannelArea';
import { ChatTalkArea } from './ChatTalkArea';

const PleaseLogin = () => {
  return (
    <div style={{ margin: 'auto' }}>
      <h1>Please login</h1>
    </div>
  );
};

const ChooseRoom = () => {
  return (
    <div style={{ margin: 'auto' }}>
      <h1>部屋を選べ</h1>
    </div>
  );
};

export const Chat = () => {
  const { currentUserInfo } = useCurrentUser();
  const [selectedChannel, setSelectedChannel] = useAtom(selectedChannelAtom);
  const { joinedRooms } = useCurrentUser();

  if (currentUserInfo === undefined) {
    return <PleaseLogin />;
  }
  return (
    <Container>
      <ContainerItem display={'flex'} flexRatio={1}>
        <ChatChannelArea
          channels={joinedRooms}
          setSelectedChannel={setSelectedChannel}
        />
      </ContainerItem>
      <ContainerItem display={'flex'} flexRatio={4}>
        {selectedChannel === undefined ? (
          <ChooseRoom />
        ) : (
          <ChatTalkArea selectedChannel={selectedChannel} />
        )}
      </ContainerItem>
    </Container>
  );
};
