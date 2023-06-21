import { ChangeEvent, useState } from 'react';

import { ContainerItem } from '@/components/Layout/ContainerItem';
import { Container } from '@/components/Layout/Container';
import { Input } from '@/components/Elements/Input/Input';
import { useFocus } from '@/hooks/useFocus';

import { useSearch } from '../api/useSearch';
import { UserInfo } from '../types/UserDto';
import { chatChannelDto } from '../../chat/types/chatChannelDto';
import styled from 'styled-components';
import { isUserInfo, isChatChannelDto } from '@/utils/typeGuars';


const StyledButton = styled.button`
  align-items: flex-start;
  height: 50px;
`

export const SearchUserOrChannel = () => {
  const { focusRef } = useFocus();
  const { searchedList, searcher } = useSearch<UserInfo | chatChannelDto>();
  const [isSearchingUser, setIsSearchingUser] = useState(true);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if(isSearchingUser){
      searcher('/user/search/', e.target.value);
    } else {
      searcher('/chat/search/', e.target.value);
    }
  };

  return (
    <div>
      <Container flexDirection={'column'}>
        <Container flexDirection={'row'}>
        <StyledButton onClick={() => setIsSearchingUser(true)}>
        User Search
        </StyledButton>
        <StyledButton onClick={() => setIsSearchingUser(false)}>
        room Search
        </StyledButton>

        </Container>
        <ContainerItem overflowY="scroll">
          {searchedList.map((elm, key) => {
            if (isUserInfo(elm)){
              return <p key={key}> {elm.username}</p>
            } else if (isChatChannelDto(elm)){
              return <p key={key}> {elm.roomName}</p>
            }
          })}
        </ContainerItem>
        <Input focusRef={focusRef} onChangeAct={onChange} placeholder= {isSearchingUser? "username": "roomname"}  />
      </Container>
    </div>
  );
};
