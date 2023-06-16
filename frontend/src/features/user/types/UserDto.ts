export type SignUpDto = {
  email: string;
  username: string;
  hashedPassword: string;
};

export type LoginDto = {
  email: string;
  hashedPassword: string;
};

export type UserInfo = {
  id: string;
  username: string;
};
