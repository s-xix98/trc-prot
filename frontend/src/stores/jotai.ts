import { atom } from 'jotai';

import { UserInfo } from '../features/user/types/UserDto';
import { chatChannelDto } from '../features/chat/types/chatChannelDto';

// TODO : ファイル名をかもうちょい考える, いったん移動
export const userInfoAtom = atom<UserInfo | undefined>(undefined);
export const channelListAtom = atom<chatChannelDto[]>([]);
