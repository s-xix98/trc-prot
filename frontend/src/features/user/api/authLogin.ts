import { BACKEND } from "@/constants";
export const useAuthLogin = () => {

  const login = (path: string) => {
    window.location.href = BACKEND + path;
  };


  return login;
}