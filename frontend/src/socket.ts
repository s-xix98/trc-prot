import { io } from 'socket.io-client';

import { BACKEND } from './constants';

export const socket = io(BACKEND);
