'use client';

import { useAtomValue } from 'jotai';
import { useState } from 'react';

import { Container } from '@/components/Layout/Container';
import { ContainerItem } from '@/components/Layout/ContainerItem';
import { channelListAtom } from '@/stores/jotai';
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
  const { userInfo } = useCurrentUser();
  const [selectedChannel, setSelectedChannel] = useState<chatChannelDto>();
  const channels = useAtomValue(channelListAtom);

  if (userInfo === undefined) {
    return <PleaseLogin />;
  }
  return (
    <Container>
      <ContainerItem display={'flex'} flexRatio={1}>
        <ChatChannelArea
          channels={channels}
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
