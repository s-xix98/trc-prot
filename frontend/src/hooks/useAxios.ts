import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
const SetAccessTokenForRequest = async (
  req: InternalAxiosRequestConfig,
) => {
  return req;
};

const handleUnauthorizedResponse = async (res: AxiosResponse) => {
  return res;
};

export const useAuthAxios = () => {
  const customAxios = axios.create();

  customAxios.interceptors.request.use(SetAccessTokenForRequest);
  customAxios.interceptors.response.use(handleUnauthorizedResponse);

  return customAxios;
}
