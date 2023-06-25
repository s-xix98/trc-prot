import { Input } from '@/components/Elements/Input/Input';
import { useInput } from '@/hooks/useInput';

import { chatChannelDto } from '../types/chatChannelDto';
import { useSendMessage } from '../api/sendMsg';

export const ChatInput = ({
  selectedChannel,
}: {
  selectedChannel: chatChannelDto;
}) => {
  const sendMessage = useSendMessage();
  const { input, onChangeAct, onKeyDownAct } = useInput(() => {
    sendMessage.emit(selectedChannel.id, input);
  });

  return (
    <>
      <Input
        msg={input}
        start={'> '}
        onChangeAct={onChangeAct}
        onKeyDownAct={onKeyDownAct}
      />
    </>
  );
};
