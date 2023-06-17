const storageKey = 'access_token';

export const tokenStorage = {
  get:() => {
    return localStorage.getItem(storageKey);
  },
  set:(token : string ) => {
    localStorage.setItem(storageKey, token);
  },
  remove: () => {
    localStorage.removeItem(storageKey);
  }
}