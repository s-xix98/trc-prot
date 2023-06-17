import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { tokenStorage } from '@/utils/tokenStorage';
class authError extends Error {
  constructor(e?:string){
    super(e);
  }
}
const getAccessTokenFromSession = async() => {
  const session = await getSession();
  const accessToken = session?.accessToken;
  if (!accessToken) {
    throw new authError('no session');
  }
  return accessToken;
}

const SetAccessTokenForRequest = async (
  req: InternalAxiosRequestConfig,
) => {
  let token = tokenStorage.get();

  if (!token){
    token = await getAccessTokenFromSession();
    tokenStorage.set(token);
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

export const useAuthAxios = () => {
  const customAxios = axios.create();
  const router = useRouter();

  // eslint-disable-next-line
      router.push('/login');
    }
    throw err;
  };

  customAxios.interceptors.request.use(SetAccessTokenForRequest,routeOnAuthErr);
  customAxios.interceptors.response.use(handleUnauthorizedResponse, routeOnAuthErr);

  return customAxios;
}
