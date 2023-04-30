import axios from 'axios';

import { MessageDto } from '../types/MessageDto';

export const postMessage = (authorId: number, msg: string) => {
  const url = 'http://localhost:8000/post-message';

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
