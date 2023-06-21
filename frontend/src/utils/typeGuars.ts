import {chatChannelDto} from "../features/chat/types/chatChannelDto";
import { UserInfo } from "../features/user/types/UserDto";

//eslint-disable-next-line
export const isChatChannelDto = (obj: any): obj is chatChannelDto => {
  return obj && typeof obj.roomName === 'string';
}

//eslint-disable-next-line
export const isUserInfo = (obj: any): obj is UserInfo => {
  return obj && typeof obj.username === 'string';
}


