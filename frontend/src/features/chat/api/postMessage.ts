import axios from 'axios';

import { MessageDto } from '../types/MessageDto';

export const postMessage = (msg: string) => {
  const url = 'http://localhost:8000/post-message';

  // 一旦、AuthorId 1
  const tmpAuthorId = 1;
  const msgDto: MessageDto = { content: msg, authorId: tmpAuthorId };

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
