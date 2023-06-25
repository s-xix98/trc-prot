import { ChangeEvent } from 'react';

import { ContainerItem } from '@/components/Layout/ContainerItem';
import { Container } from '@/components/Layout/Container';
import { Input } from '@/components/Elements/Input/Input';
import { useFocus } from '@/hooks/useFocus';

import { useSearch } from '../../../hooks/useSearch';
import { UserInfo } from '../types/UserDto';
const SearchedResult = ({searchedList}:{searchedList :UserInfo[]}) => {
  return (
    <>
      {searchedList.map((user, idx) => <p key={idx}> {user.username}</p> )}
    </>
  );
};


export const UserSearch = () => {
  const { focusRef } = useFocus();
  const { searchedList, searcher } = useSearch<UserInfo>();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
      searcher('/user/search', e.target.value);
  };

  return (
    <Container>
          <h2>User Search</h2>
        <ContainerItem overflowY="scroll">
          <SearchedResult searchedList={searchedList}/>
        </ContainerItem>
      <Input
        focusRef={focusRef}
        onChangeAct={onChange}
        placeholder={'username'}
        />
    </Container>
  );
};
