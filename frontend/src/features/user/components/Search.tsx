import { ContainerItem } from "@/components/Layout/ContainerItem";
import { Container } from "@/components/Layout/Container";
import { TextField } from "@mui/material";

export const SearchUser = () => {
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
    />
    </Container>
    </div>
  );
};