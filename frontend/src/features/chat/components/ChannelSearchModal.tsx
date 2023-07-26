import { ChangeEvent } from 'react';

import { ContainerItem } from '@/components/Layout/ContainerItem';
import { Container } from '@/components/Layout/Container';
import { Input } from '@/components/Elements/Input/Input';
import { useFocus } from '@/hooks/useFocus';
import { ModalView } from '@/components/Elements/Modal/ModalView';
import { useSearch } from '@/hooks/useSearch';
import { useModal } from '@/hooks/useModal';

import { chatChannelDto, chatChannelSchema } from '../types/chatChannelDto';

import { ChannelListWithModal } from './ChannelInfo';

export const ChannelSearchModal = () => {
  const { focusRef } = useFocus();
  const { searchedList, searcher } =
    useSearch<chatChannelDto>(chatChannelSchema);
  const { modalIsOpen, openModal, closeModal } = useModal();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    searcher('/chat/search', e.target.value);
  };

  const onClick = () => {
    openModal();
  };

  return (
    <>
      <p onClick={onClick}>Channel Search</p>
      <ModalView
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        width="200px"
        height="250px"
      >
        <Container flexDirection={'column'}>
          <h2>ChannelSearch</h2>
          <ContainerItem overflowY="scroll">
            <ChannelListWithModal channelList={searchedList} />
          </ContainerItem>
          <Input
            focusRef={focusRef}
            onChangeAct={onChange}
            placeholder={'channel name'}
          />
        </Container>
      </ModalView>
    </>
  );
};
