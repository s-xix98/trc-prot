import { SnackbarKey, closeSnackbar, useSnackbar } from 'notistack';

import { useSessionSocket } from '@/hooks/useSocket';
import { UserInfoSchema } from '@/features/user/types/UserDto';
import { useAcceptGameInvite } from '@/features/game/api/acceptGameInvite';
import { useDenyGameInvite } from '@/features/game/api/denyGameInvite';

export const useGameHandler = () => {
  const acceptGameInvite = useAcceptGameInvite();
  const denyGameInvite = useDenyGameInvite();
  const { enqueueSnackbar } = useSnackbar();

  useSessionSocket('receive game-invitation', (data) => {
    const inviterUserInfo = UserInfoSchema.safeParse(data);
    if (inviterUserInfo.success == false) {
      console.log('Error : receive game-invitation');
      return;
    }

    const acceptAct = (snackbarId: SnackbarKey) => {
      acceptGameInvite.emit(inviterUserInfo.data);
      closeSnackbar(snackbarId);
    };
    const denyAct = (snackbarId: SnackbarKey) => {
      denyGameInvite.emit(inviterUserInfo.data);
      closeSnackbar(snackbarId);
    };

    enqueueSnackbar(
      `receive game-invitation from ${inviterUserInfo.data.username}`,
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
