import { ContainerItem } from "@/components/Layout/ContainerItem";
import { Container } from "@/components/Layout/Container";
import { TextField } from "@mui/material";
import { useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { socket } from "@/socket";
import { searchUserDto } from "../types/SearchUserDto";

export const SearchUser = () => {
  const [searchWord, setSearchWord] = useState('');
  const [searchUsers, setSearchUsers] = useState<string[]>([]);

  type userData = {
    username: string;
  }

  // TODO userInfoのnicknameを変えたらuserinfoにする
  useSocket('searchUser', (data: userData[]) => {
    setSearchUsers(data.map((user) => user.username));
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchWord:searchUserDto = {searchWord: e.target.value}
    socket.emit('searchUser', searchWord);
    setSearchWord(e.target.value)
  }

  return (
    <div>
    <Container flexDirection={'column'}>
    <div>User Search</div>
    <ContainerItem overflowY="scroll">
      {searchUsers.map((user, key) => {
        return (
          <p key={key}> {user}</p>
          )
        })}
    </ContainerItem>
    <TextField
      variant="standard"
      placeholder="username"
      color="success"
      sx={{
        '& .MuiInputBase-input': {
        color: '#33ff33', // Text color
        backgroundColor: '#303030', // 背景色
      }
      }}
      value={searchWord}
      onChange={onChange}
    />
    </Container>
    </div>
  );
};