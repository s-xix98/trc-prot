import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';

const storageKey = 'access_token';

const getAccessTokenFromSession = async() => {
  const session = await getSession();
  const accessToken = session?.accessToken;
  if (!accessToken) {
    throw new Error('no session');
  }
  return accessToken;
}

const SetAccessTokenForRequest = async (
  req: InternalAxiosRequestConfig,
) => {
  let token = localStorage.getItem(storageKey);

  if (!token){
    token = await getAccessTokenFromSession();
    localStorage.setItem(storageKey, token);
  }

  const authHeaders = `Bearer ${token}`;
  req.headers.Authorization = authHeaders;
  return req;
};

const handleUnauthorizedResponse = async (res: AxiosResponse) => {
  if (res.status === 401) {
    throw new Error('401');
  }
  return res;
};

export const useAuthAxios = () => {
  const customAxios = axios.create();

  customAxios.interceptors.request.use(SetAccessTokenForRequest);
  customAxios.interceptors.response.use(handleUnauthorizedResponse);

  return customAxios;
}
