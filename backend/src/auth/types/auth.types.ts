export type accessToken = {
  jwt: string;
};

export type authUser = {
  id: string;
  email: string;
  provider: string;
};

export type jwtPayload = {
  userId: string;
  username: string;
  isTwoFaEnabled: boolean;
  isTwoFactorAuthenticated: boolean;
};
