import { Container } from '../../components/Layout/Container';
import { ContainerItem } from '../../components/Layout/ContainerItem';
import { ChatChannelArea } from './ChatChannelArea';
import { ChatTalkArea } from './ChatTalkArea';

export const Chat = () => {
  return (
    <Container>
      <ContainerItem display={'flex'} flexRatio={1}>
        <ChatChannelArea />
      </ContainerItem>
      <ContainerItem display={'flex'} flexRatio={4}>
        <ChatTalkArea />
      </ContainerItem>
    </Container>
  );
};
