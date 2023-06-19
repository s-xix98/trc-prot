const tokenKey = 'access_token';

export const tokenStorage = {
  get: () => {
    return localStorage.getItem(tokenKey);
  },
  set: (token: string) => {
    localStorage.setItem(tokenKey, token);
  },
  remove: () => {
    localStorage.removeItem(tokenKey);
  },
};