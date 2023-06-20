'use client';

import { useAtomValue } from 'jotai';
import { useState } from 'react';

import { Container } from '@/components/Layout/Container';
import { ContainerItem } from '@/components/Layout/ContainerItem';
import { userInfoAtom } from '@/stores/jotai';
import { channelListAtom } from '@/stores/jotai';

import { chatChannelDto } from '../types/chatChannelDto';

import { ChatChannelArea } from './ChatChannelArea';
import { ChatTalkArea } from './ChatTalkArea';
export const Chat = () => {
  const userInfo = useAtomValue(userInfoAtom);
  const [selectedChannel, setSelectedChannel] = useState<chatChannelDto>();
  const channels = useAtomValue(channelListAtom);

  if (userInfo === undefined) {
    return (
      <div style={{ margin: 'auto' }}>
        <h1>Please login</h1>
      </div>
    );
  }
  return (
    <Container>
      <ContainerItem display={'flex'} flexRatio={1}>
        <ChatChannelArea
          userInfo={userInfo}
          channels={channels}
          setSelectedChannel={setSelectedChannel}
        />
      </ContainerItem>
      <ContainerItem display={'flex'} flexRatio={4}>
        {selectedChannel === undefined ? (
          <div style={{ margin: 'auto' }}>
            <h1>部屋を選べ</h1>
          </div>
        ) : (
          <ChatTalkArea selectedChannel={selectedChannel} />
        )}
      </ContainerItem>
    </Container>
  );
};
