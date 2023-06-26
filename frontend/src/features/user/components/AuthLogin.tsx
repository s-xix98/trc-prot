import { useAuthLogin } from '../api/authLogin';

export const AuthLogin = ({
  provider,
  path,
}: {
  provider: string;
  path: string;
}) => {
  const login = useAuthLogin();

  const onClick = () => {
    login(path);
  };

  return <button onClick={onClick}>{provider}</button>;
};
