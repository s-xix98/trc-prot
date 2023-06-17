import { Container } from '../Layout/Container';
import { FriendshipDrawer } from './FriendShipDrawer';

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
        <FriendshipDrawer/>
        <div style={{ margin: 'auto 10px auto auto' }}>
          <HeaderLink name="STORYBOOK" href={'http://localhost:6006/'} />
          <HeaderLink name="SWAGGER" href={'http://localhost:8000/api'} />
          <HeaderLink name="PRISMA" href={'http://localhost:5555'} />
        </div>
      </Container>
      <hr />
    </div>
  );
};
