import { SnackbarKey, closeSnackbar, useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useSessionSocket } from '@/hooks/useSocket';
import { useAcceptGameInvite } from '@/features/game/api/acceptGameInvite';
import { useDenyGameInvite } from '@/features/game/api/denyGameInvite';
import { UserGameOptionSchema } from '@/features/game/types/gameOptionDto';

export const useGameHandler = () => {
  const acceptGameInvite = useAcceptGameInvite();
  const denyGameInvite = useDenyGameInvite();
  const { enqueueSnackbar } = useSnackbar();

  const [isMatched, setMatched] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isMatched) {
      // TODO : 2回目以降動いてくれないので、設定
      // Game Page への 遷移もうちょい、ちゃんする
      setMatched(false);
      router.push('/game');
    }
  }, [isMatched, router]);

  useSessionSocket('matched', (enemyName: string) => {
    console.log(enemyName);
    setMatched(true);
  });

  useSessionSocket('receive game-invitation', (data) => {
    const invitedGame = UserGameOptionSchema.safeParse(data);
    if (invitedGame.success == false) {
      console.log('Error : receive game-invitation');
      return;
    }

    const acceptAct = (snackbarId: SnackbarKey) => {
      acceptGameInvite.emit(invitedGame.data.user);
      closeSnackbar(snackbarId);
      router.refresh();
    };
    const denyAct = (snackbarId: SnackbarKey) => {
      denyGameInvite.emit(invitedGame.data.user);
      closeSnackbar(snackbarId);
    };

    enqueueSnackbar(
      `receive game-invitation from ${invitedGame.data.user.username}\n
      matchpoint : ${invitedGame.data.opt.matchpoint}, ballSpeed: ${invitedGame.data.opt.ballSpeed}`,
      {
        action: (snackbarId) => (
          <>
            <button onClick={() => acceptAct(snackbarId)}>Accept</button>
            <button onClick={() => denyAct(snackbarId)}>Deny</button>
          </>
        ),
      },
    );
  });
};
