import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useStoreState } from "../../hooks/store";
import Redirect from "../Redirect";

type AuthMiddlewareProps = { href?: string };

const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ href, children }) => {
   const user = useStoreState((state) => state.user);
   const authToken = useStoreState((state) => state.authToken);

   // const router = useRouter();

   // useEffect(() => {
   //    if (!user || !authToken) router.replace();
   // }, [user, authToken, router, href]);

   return !user || !authToken ? (
      <Redirect to={href ?? "/auth/login"} />
   ) : (
      <>{children}</>
   );
};

export default AuthMiddleware;
