import { ChangeEvent, useState } from 'react';
import styled from 'styled-components';

import { ContainerItem } from '@/components/Layout/ContainerItem';
import { Container } from '@/components/Layout/Container';
import { Input } from '@/components/Elements/Input/Input';
import { useFocus } from '@/hooks/useFocus';
import { isUserInfo, isChatChannelDto } from '@/utils/typeGuars';

import { useSearch } from '../api/useSearch';
import { UserInfo } from '../types/UserDto';

import { chatChannelDto } from '../../chat/types/chatChannelDto';
import { ChannelEntryModal } from '../../chat/components/ChannelEntryModal';

const StyledButton = styled.button`
  align-items: flex-start;
`;

export const SearchUserOrChannel = () => {
  const { focusRef } = useFocus();
  const { searchedList, searcher } = useSearch<UserInfo | chatChannelDto>();
  const [isSearchingUser, setIsSearchingUser] = useState(true);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isSearchingUser) {
      searcher('/user/search', e.target.value);
    } else {
      searcher('/chat/search', e.target.value);
    }
  };

  return (
    <div>
      <Container flexDirection={'column'}>
        <ContainerItem>
          <StyledButton onClick={() => setIsSearchingUser(true)}>
            User Search
          </StyledButton>
          <StyledButton onClick={() => setIsSearchingUser(false)}>
            room Search
          </StyledButton>
          <ContainerItem overflowY="scroll">
            {searchedList.map((elm, key) => {
              if (isUserInfo(elm)) {
                return <p key={key}> {elm.username}</p>;
              } else if (isChatChannelDto(elm)) {
                return <ChannelEntryModal channelData={elm} key={key} />;
              }
            })}
          </ContainerItem>
        </ContainerItem>
        <Input
          focusRef={focusRef}
          onChangeAct={onChange}
          placeholder={isSearchingUser ? 'username' : 'roomname'}
        />
      </Container>
    </div>
  );
};
