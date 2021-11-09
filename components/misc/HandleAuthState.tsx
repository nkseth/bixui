import { useEffect } from "react";

import api from "../../constants/api";
import { User } from "../../constants/types";
import { useStoreActions, useStoreState } from "../../hooks/store";

export default function HandleAuthState() {
   const authToken = useStoreState((state) => state.authToken);
   const setAuthToken = useStoreActions((actions) => actions.setAuthToken);
   const setUser = useStoreActions((actions) => actions.setUser);

   useEffect(() => {
      const authToken = localStorage.getItem("authToken");
      setAuthToken(authToken);
   }, [setAuthToken]);

   // Listen for authChanges
   useEffect(() => {
      if (!authToken) {
         api.defaults.headers.common["Authorization"] = null;
         localStorage.removeItem("authToken");
         setUser(null);
         return;
      }

      localStorage.setItem("authToken", authToken);

      api.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

      api.get("/me")
         .then((res) => {
            setUser(res.data as User);
         })
         .catch((err) => {
            if (err?.response?.status === 401) {
               setAuthToken(null);
            }
         });
   }, [authToken, setUser, setAuthToken]);

   return null;
}
