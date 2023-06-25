import { ChangeEvent } from 'react';

import { ContainerItem } from '@/components/Layout/ContainerItem';
import { Container } from '@/components/Layout/Container';
import { Input } from '@/components/Elements/Input/Input';
import { useFocus } from '@/hooks/useFocus';

import { useSearch } from '../../../hooks/useSearch';
import { chatChannelDto } from '../types/chatChannelDto';

const SearchedResult = (searchedList: chatChannelDto[]) => {
  return (
    <>
    {searchedList.map((channel, idx) => <p key={idx}> {channel.roomName}</p> )}
    </>
  );
};

export const ChannelSearch = () => {
  const { focusRef } = useFocus();
  const { searchedList, searcher } = useSearch<chatChannelDto>();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
      searcher('/chat/search', e.target.value);
  };

  return (
    <div>
      <Container flexDirection={'column'}>
            <h2>Channel Search</h2>
          <ContainerItem overflowY="scroll">
            {SearchedResult(searchedList)}
          </ContainerItem>
        <Input
          focusRef={focusRef}
          onChangeAct={onChange}
          placeholder={'channel name'}
        />
      </Container>
    </div>
  );
};
