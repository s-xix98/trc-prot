import { useState } from 'react';
import { ChangeEvent } from 'react';

import { ContainerItem } from '@/components/Layout/ContainerItem';
import { Container } from '@/components/Layout/Container';
import { useSocket } from '@/hooks/useSocket';
import { socket } from '@/socket';
import { Input } from '@/components/Elements/Input/Input';

import { searchUserDto } from '../types/SearchUserDto';
import { UserInfo } from '../types/UserDto';

export const SearchUser = () => {
  const [searchWord, setSearchWord] = useState('');
  const [searchUsers, setSearchUsers] = useState<string[]>([]);

  useSocket('searchUser', (data: UserInfo[]) => {
    setSearchUsers(data.map((user) => user.username));
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value);

    if (e.target.value.length === 0) {
      setSearchUsers([]);
      return;
    }

    const dto: searchUserDto = { searchWord: e.target.value };

    socket.emit('searchUser', dto);
  };

  return (
    <div>
      <Container flexDirection={'column'}>
        <div>User Search</div>
        <ContainerItem overflowY="scroll">
          {searchUsers.map((user, key) => (
            <p key={key}> {user}</p>
          ))}
        </ContainerItem>
        <Input msg={searchWord} onChangeAct={onChange} placeholder="username" />
      </Container>
    </div>
  );
};
