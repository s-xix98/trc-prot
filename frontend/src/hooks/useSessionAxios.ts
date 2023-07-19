import axios, { InternalAxiosRequestConfig } from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { ZodError, z } from 'zod';
import { useSnackbar } from 'notistack';

import { tokenStorage } from '@/utils/tokenStorage';
import { BACKEND } from '@/constants';
import { useLogout } from '@/features/user/api/userLogin';

const setAccessTokenForRequest = (req: InternalAxiosRequestConfig) => {
  const token = tokenStorage.get();
  if (token) {
    const authHeaders = `Bearer ${token}`;
    req.headers.Authorization = authHeaders;
  }
  return req;
};

const customAxios = axios.create({
  baseURL: BACKEND,
});

export const useSessionAxios = () => {
  const router = useRouter();
  const { logout } = useLogout();

  useEffect(() => {
    customAxios.interceptors.request.use(setAccessTokenForRequest);
    customAxios.interceptors.response.use(
      (res) => {
        return res;
      },
      (error) => {
        // 401 の時のみ login に飛ばす
        if (error?.response?.status === 401) {
          logout();
        }

        return Promise.reject(error);
      },
    );
  }, [router, logout]);

  return customAxios;
};

export const useCustomAxiosGetter = () => {
  const customAxios = useSessionAxios();
  const { enqueueSnackbar } = useSnackbar();

  const customAxiosGetter = useCallback(
    <T>(
      uri: string,
      Schema: z.ZodSchema<T>,
      onSucessCallback: (resData: T) => void,
    ) => {
      console.log('useCustomAxiosGetter', uri);
      customAxios
        .get(uri)
        .then((res) => {
          console.log('customAxiosGetter', res.data);
          try {
            const resData = Schema.parse(res.data);
            onSucessCallback(resData);
          } catch (e) {
            if (e instanceof ZodError) {
              // TODO : for debug
              console.log('Zod Error :', e.message);
              enqueueSnackbar(`Zod Error : ${e.message}`);
            } else {
              throw e;
            }
          }
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar(err?.response?.data?.message);
        });
    },
    [customAxios, enqueueSnackbar],
  );

  return { customAxiosGetter };
};
