'use client';

import { useAtomValue } from 'jotai';

import { Container } from '@/components/Layout/Container';
import { ContainerItem } from '@/components/Layout/ContainerItem';
import { userInfoAtom } from '@/App';

import { ChatChannelArea } from './ChatChannelArea';
import { ChatTalkArea } from './ChatTalkArea';

import { selectedChannelAtom } from '../../../App';
export const Chat = () => {
  const userInfo = useAtomValue(userInfoAtom);
  const selectedChannel = useAtomValue(selectedChannelAtom);

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
        <ChatChannelArea />
      </ContainerItem>
      <ContainerItem display={'flex'} flexRatio={4}>
        {selectedChannel === undefined ? (
          <div style={{ margin: 'auto' }}>
            <h1>部屋を選べ</h1>
          </div>
        ) : (
          <ChatTalkArea />
        )}
      </ContainerItem>
    </Container>
  );
};
