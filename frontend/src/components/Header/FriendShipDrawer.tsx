import { Drawer } from "@mui/material";
import { useState } from 'react';
import { Container } from "../Layout/Container";
export const FriendshipDrawer = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <div>
    <button onClick={()=> setDrawerOpen(true)}>
      openDrawer
      </button>
      <Drawer
      open={isDrawerOpen}
      onClose={()=> setDrawerOpen(false)}

      PaperProps={{
        style: {
          backgroundColor: '#8c8282',
        },
      }}
      >
        <Container flexDirection="column">
          <h2>MyState</h2>
          <h2>DM</h2>
          <h2>FriendList</h2>
          <h2>BlockList</h2>
        </Container>
      </Drawer>
    </div>
  );
}