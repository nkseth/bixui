import { useRouter } from "next/dist/client/router";
import React, { useEffect } from "react";

export default function Redirect({ to }: { to: string }) {
   const router = useRouter();

   useEffect(() => {
      router.push(to);
   }, [router, to]);

   return null;
}
