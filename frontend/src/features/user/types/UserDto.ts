export type SignUpDto = {
  email: string;
  nickname: string;
  hashedPassword: string;
};

export type LoginDto = {
  email: string;
  hashedPassword: string;
};

export type UserInfo = {
  id: string;
  nickname: string;
};
