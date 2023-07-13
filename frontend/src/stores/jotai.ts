import { atom } from 'jotai';
import { Socket } from 'socket.io-client';

import { UserInfo } from '../features/user/types/UserDto';
import { chatChannelDto } from '../features/chat/types/chatChannelDto';

// TODO : ファイル名をかもうちょい考える, いったん移動
export const userInfoAtom = atom<UserInfo | undefined>(undefined);
export const socketAtom = atom<Socket | undefined>(undefined);
export const channelListAtom = atom<chatChannelDto[]>([]);
