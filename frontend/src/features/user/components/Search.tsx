
export const SearchUser = () => {
  const mockUsers = []
  for (let i = 0; i < 10; i++) {
    mockUsers.push(`user${i}`);
  }

  return (
    <>
      <div>User Search</div>
      <div>
      {mockUsers.map((user, key) => {
        return (
          <li key={key}> {user}</li>
        )
        })};
      </div>
    </>
  );
};