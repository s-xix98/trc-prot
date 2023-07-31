import { useRouter } from 'next/navigation';

import { Container } from '../Layout/Container';

import { useLogin } from '../../features/user/api/userLogin';

const HeaderLink = ({ href, name }: { href: string; name: string }) => {
  return (
    <a href={href} style={{ padding: '3px' }}>
      {name}
    </a>
  );
};

export const Header = () => {
  const router = useRouter();
  const { manualLogin } = useLogin();

  const gotoTopPage = () => {
    router.push('/');
  };

  // TODO : 消す
  const loginAsHuga = () => {
    manualLogin('huga@example.com', 'hugahuga');
  };
  const loginAsPiyo = () => {
    manualLogin('piyo@example.com', 'piyopiyo');
  };

  return (
    <div>
      <Container>
        <h1 onClick={gotoTopPage}>Header</h1>
        <div style={{ margin: 'auto 10px auto auto' }}>
          <HeaderLink name="STORYBOOK" href={'http://localhost:6006/'} />
          <HeaderLink name="SWAGGER" href={'http://localhost:8000/api'} />
          <HeaderLink name="PRISMA" href={'http://localhost:5555'} />
          <span>&nbsp;</span>
          <button onClick={loginAsHuga}>login as fuga</button>
          <button onClick={loginAsPiyo}>login as piyo</button>
        </div>
      </Container>
      <hr />
    </div>
  );
};
