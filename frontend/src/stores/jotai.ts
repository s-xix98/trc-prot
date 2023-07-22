import { atom } from 'jotai';
import { Socket } from 'socket.io-client';

import { CurrentUser } from '@/features/user/types/CurrentUser';

// TODO : ファイル名をかもうちょい考える, いったん移動
export const currentUserAtom = atom<CurrentUser | undefined>(undefined);
export const socketAtom = atom<Socket | undefined>(undefined);
