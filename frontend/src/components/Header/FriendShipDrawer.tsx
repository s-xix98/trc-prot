import { Drawer } from "@mui/material";
import { useState } from 'react';
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
      >
        a
      </Drawer>
    </div>
  );
}