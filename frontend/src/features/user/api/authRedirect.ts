import { useEffect } from "react";
import { tokenStorage } from "@/utils/tokenStorage";

export const useReceiveAuthRedirect = () => {
	useEffect	(() => {
		const queryStr = window.location.search;
		const urlParams = new URLSearchParams(queryStr);
		const token = urlParams.get('access_token');
		if (token) {
			console.log('token:', token);
			tokenStorage.set(token);

		}
	},[]);
};