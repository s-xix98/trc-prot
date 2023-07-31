'use client';

import { Container } from '@/components/Layout/Container';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Game } from '@/features/game/Game';

export default function GamePage() {
  return (
    <MainLayout>
      <Container flexDirection={'column'}>
        <div>
          <Game />
        </div>
      </Container>
    </MainLayout>
  );
}
