import { FormikHelpers } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import Head from "next/head";

import Form from "../../components/auth/Form";
import Header from "../../components/auth/Header";
import GuestMiddleware from "../../components/middleware/GuestMiddleware";

import api from "../../constants/api";
import { useStoreActions } from "../../hooks/store";

import styles from "../../styles/auth/Login.module.scss";

export default function Login() {
   const setAuthToken = useStoreActions((actions) => actions.setAuthToken);

   const [isSubmitting, setIsSubmitting] = useState(false);

   const handleLogin = async (
      values: { email: string; password: string },
      helpers: FormikHelpers<any>
   ) => {
      setIsSubmitting(true);

      api.post("/login", values)
         .then((res) => {
            const authToken = res.data.access_token as string;
            setAuthToken(authToken);
         })
         .catch((err) => {
            helpers.setErrors(
               err.response?.data?.errors ?? { email: "Unknown error" }
            );
         })
         .finally(() => {
            setIsSubmitting(false);
         });
   };

   const validationSchema = Yup.object().shape({
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string().required("Required"),
   });

   return (
      <GuestMiddleware>
         <Head>
            <title>Login</title>
         </Head>
         <div className={styles.container}>
            <Header />
            <h2 className={styles.title}>Biz Connect Events</h2>
            <Form
               title="Log In"
               inputs={[
                  {
                     name: "email",
                     type: "email",
                     placeholder: "Email",
                  },
                  {
                     name: "password",
                     type: "password",
                     placeholder: "Password",
                  },
               ]}
               validationSchema={validationSchema}
               actionTitle="Login"
               onSubmit={handleLogin}
               //secondaryActions={[
                // {
                 //    title: "Not Subscribed ? Subscribe Now",
                 //    href: "/auth/register",
                //  },
                //  { title: "Forgot Password ?", href: "/" },
               //]}
               isSubmitting={isSubmitting}
            />
         </div>
      </GuestMiddleware>
   );
}
