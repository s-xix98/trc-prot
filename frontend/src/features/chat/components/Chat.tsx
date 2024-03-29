'use client';

import { useEffect, useState } from 'react';

import { Container } from '@/components/Layout/Container';
import { ContainerItem } from '@/components/Layout/ContainerItem';
import { useCurrentUser } from '@/hooks/useCurrentUser';

import { chatChannelDto } from '../types/chatChannelDto';

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
  const [selectedChannel, setSelectedChannel] = useState<chatChannelDto>();
  const { joinedRooms } = useCurrentUser();

  useEffect(() => {
    setSelectedChannel(
      (prev) => joinedRooms.find((r) => r.id === prev?.id) || prev,
    );
  }, [joinedRooms, setSelectedChannel]);

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
          <ChatTalkArea
            selectedChannel={selectedChannel}
            setSelectedChannel={setSelectedChannel}
          />
        )}
      </ContainerItem>
    </Container>
  );
};
