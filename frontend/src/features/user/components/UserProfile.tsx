import { UserInfo } from '../types/UserDto';

export const UserProfile = ({ userInfo }: { userInfo: UserInfo }) => {
  return (
    <div>
      <h1>{userInfo?.username}</h1>
      <hr />
      <br />
      <button>fake : send frend req</button>
      <button>fake : send block req</button>
    </div>
  );
};
