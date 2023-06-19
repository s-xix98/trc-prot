import { Container } from '../Layout/Container';

const HeaderLink = ({ href, name }: { href: string; name: string }) => {
  return (
    <a href={href} style={{ padding: '3px' }}>
      {name}
    </a>
  );
};

export const Header = () => {
  return (
    <div>
      <Container>
        <h1>Header</h1>
        <div style={{ margin: 'auto 10px auto auto' }}>
          <HeaderLink name="huga" href={'http://localhost:3000/login/huga'} />
          <HeaderLink name="piyo" href={'http://localhost:3000/login/piyo'} />
          <HeaderLink name="STORYBOOK" href={'http://localhost:6006/'} />
          <HeaderLink name="SWAGGER" href={'http://localhost:8000/api'} />
          <HeaderLink name="PRISMA" href={'http://localhost:5555'} />
        </div>
      </Container>
      <hr />
    </div>
  );
};
