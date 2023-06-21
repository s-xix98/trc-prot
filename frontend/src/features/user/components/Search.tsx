import { ChangeEvent } from 'react';

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

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    searcher('/user/search/', e.target.value);
  };

  return (
    <div>
      <Container flexDirection={'column'}>
        <Container flexDirection={'row'}>
        <StyledButton>
        User Search
        </StyledButton>
        <StyledButton>
        room Search
        </StyledButton>

        </Container>
        <ContainerItem overflowY="scroll">
          {searchedList.map((user: UserInfo, key: number) => (
            <p key={key}> {user.username}</p>
          ))}
        </ContainerItem>
        <Input
          onChangeAct={onChange}
          placeholder="username"
          focusRef={focusRef}
        />
      </Container>
    </div>
  );
};
