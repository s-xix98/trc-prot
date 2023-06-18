import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

class authError extends Error {
  constructor(e?: string) {
    super(e);
  }
}

// backendが設定したsession時間よりnext-authが設定したsession時間(maxAge)が短いと正しく動かないかも
// next-authはデフォルトでsession時間30日らしくてbackendより長いから問題ない気がする
const setAccessTokenForRequest = async (req: InternalAxiosRequestConfig) => {
  const session = await getSession();
  const token = session?.accessToken;
  if (!token) {
    throw new authError('no session');
  }

  const authHeaders = `Bearer ${token}`;
  req.headers.Authorization = authHeaders;
  return req;
};

const handleUnauthorizedResponse = async (res: AxiosResponse) => {
  if (res.status === 401) {
    throw new authError('401');
  }
  return res;
};

export const useSessionAxios = () => {
  const router = useRouter();
  const customAxios = axios.create();

  // eslint-disable-next-line
  const routeOnAuthErr = (err: any) => {
    if (err instanceof authError) {
      router.push('/login');
    }
    throw err;
  };

  customAxios.interceptors.request.use(
    setAccessTokenForRequest,
    routeOnAuthErr,
  );
  customAxios.interceptors.response.use(
    handleUnauthorizedResponse,
    routeOnAuthErr,
  );

  return customAxios;
};