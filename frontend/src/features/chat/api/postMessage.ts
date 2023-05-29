import axios from 'axios';

import { MessageDto } from '../types/MessageDto';

import { BACKEND } from '../../../constants';

export const postMessage = (authorId: number, msg: string) => {
  const url = BACKEND + '/post-message';

  const msgDto: MessageDto = { content: msg, authorId: authorId };

  console.log('post');
  axios
    .post(url, msgDto)
    .then((res) => {
      console.log('postMessage res:', res);
    })
    .catch((err) => {
      console.log('postMessage err:', err);
    });
};
