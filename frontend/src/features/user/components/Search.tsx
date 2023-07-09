import { ChangeEvent } from 'react';

import { ContainerItem } from '@/components/Layout/ContainerItem';
import { Container } from '@/components/Layout/Container';
import { Input } from '@/components/Elements/Input/Input';
import { useFocus } from '@/hooks/useFocus';

import { UserInfo } from '../types/UserDto';

import { useSearch } from '../../../hooks/useSearch';
import { UserList } from './UserProfile';

export const UserSearch = () => {
  const { focusRef } = useFocus();
  const { searchedList, searcher } = useSearch<UserInfo>();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    searcher('/user/search', e.target.value);
  };

  return (
    <Container flexDirection="column">
      <h2>User Search</h2>
      <ContainerItem overflowY="scroll">
        <UserList userList={searchedList} />
      </ContainerItem>
      <Input
        focusRef={focusRef}
        onChangeAct={onChange}
        placeholder={'username'}
      />
    </Container>
  );
};
