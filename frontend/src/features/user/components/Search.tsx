import { useState } from 'react';
import { ChangeEvent } from 'react';

import { ContainerItem } from '@/components/Layout/ContainerItem';
import { Container } from '@/components/Layout/Container';
import { Input } from '@/components/Elements/Input/Input';

import { UserInfo } from '../types/UserDto';
import { useSessionAxios } from '../../../hooks/useSessionAxios';

export const SearchUser = () => {
  const [searchUsers, setSearchUsers] = useState<string[]>([]);
  const axios = useSessionAxios();


  const onChange = (e: ChangeEvent<HTMLInputElement>) => {

    if (e.target.value.length === 0) {
      setSearchUsers([]);
      return;
    }

    axios.get<UserInfo[]>('/user/search/' + e.target.value)
    .then((res)=>{
      const users = res.data.map((user: UserInfo) => user.username);
      setSearchUsers(users);
    })
    // TODO とりあえず何もしない エラー表示とか出したいね
    .catch((err)=> console.log(err));
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
        <Input onChangeAct={onChange} placeholder="username" />
      </Container>
    </div>
  );
};
