import { ChangeEvent } from 'react';

import { ContainerItem } from '@/components/Layout/ContainerItem';
import { Container } from '@/components/Layout/Container';
import { Input } from '@/components/Elements/Input/Input';
import { useSearch } from '../api/useSearch';
import { UserInfo } from '../types/UserDto';

export const SearchUser = () => {
  const {searchedList, searcher } = useSearch<UserInfo>();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    searcher('/user/search/', e.target.value);
  };

  return (
    <div>
      <Container flexDirection={'column'}>
        <div>User Search</div>
        <ContainerItem overflowY="scroll">
          {searchedList.map((user: UserInfo, key: number) => (
            <p key={key}> {user.username}</p>
          ))}
        </ContainerItem>
        <Input onChangeAct={onChange} placeholder="username" />
      </Container>
    </div>
  );
};
