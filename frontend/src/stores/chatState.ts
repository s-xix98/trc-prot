import { atom } from 'jotai';

import { chatChannelDto } from '@/features/chat/types/chatChannelDto';

export const selectedChannelAtom = atom<chatChannelDto | undefined>(undefined);
