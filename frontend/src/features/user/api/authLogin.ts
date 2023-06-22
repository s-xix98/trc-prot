import { tokenStorage } from "@/utils/tokenStorage";
import { BACKEND } from "@/constants";
import { useEffect } from "react";
export const useAuthLogin = () => {

  useEffect(() => {
    const queryParam = new URLSearchParams(window.location.search);
    const token = queryParam.get('access_token');

    if (!token) {
      return;
    }

    tokenStorage.set(token);

  }, [setUserInfo]);

  const login = (path: string) => {
    window.location.href = BACKEND + path;
  };


  return login;
}