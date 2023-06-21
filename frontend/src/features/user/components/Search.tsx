import { ChangeEvent, useState } from 'react';

import { ContainerItem } from '@/components/Layout/ContainerItem';
import { Container } from '@/components/Layout/Container';
import { Input } from '@/components/Elements/Input/Input';
import { useFocus } from '@/hooks/useFocus';

import { useSearch } from '../api/useSearch';
import { UserInfo } from '../types/UserDto';
import styled from 'styled-components';

const StyledButton = styled.button`
  align-items: flex-start;
  height: 50px;
`

export const SearchUserOrChannel = () => {
  const { searchedList, searcher } = useSearch<UserInfo>();
  const { focusRef } = useFocus();
  const [isSearchingUser, setIsSearchingUser] = useState(true);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    searcher('/user/search/', e.target.value);
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
          {searchedList.map((user: UserInfo, key: number) => (
            <p key={key}> {user.username}</p>
          ))}
        </ContainerItem>
        <Input focusRef={focusRef} onChangeAct={onChange} placeholder= {isSearchingUser? "username": "roomname"}  />
      </Container>
    </div>
  );
};
