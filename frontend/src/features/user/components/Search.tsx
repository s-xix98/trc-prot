import { ContainerItem } from "@/components/Layout/ContainerItem";
import { Container } from "@/components/Layout/Container";
import { TextField } from "@mui/material";
import { useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { socket } from "@/socket";
import { searchUserDto } from "../types/SearchUserDto";

export const SearchUser = () => {
  const [searchWord, setSearchWord] = useState('');

  useSocket('searchUser', (data) => {
    console.log('searchUser', data);
  });



  const mockUsers = []
  for (let i = 0; i < 100; i++) {
    mockUsers.push(`user${i}`);
  }

  return (
    <div>
    <Container flexDirection={'column'}>
    <div>User Search</div>
    <ContainerItem overflowY="scroll">
      {mockUsers.map((user, key) => {
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
      onChange={(e) => {
        const searchWord:searchUserDto = {searchWord: e.target.value}
        socket.emit('searchUser', searchWord);
        setSearchWord(e.target.value)
      }}
    />
    </Container>
    </div>
  );
};