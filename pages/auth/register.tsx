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

export default function Register() {
   const setAuthToken = useStoreActions((actions) => actions.setAuthToken);

   const [isSubmitting, setIsSubmitting] = useState(false);

   const handleRegister = async (
      values: {
         email: string;
         password: string;
         password_confirmation: string;
      },
      helpers: FormikHelpers<any>
   ) => {
      setIsSubmitting(true);

      api.post("/register", values)
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
      password: Yup.string()
         .required("Required")
         .min(6, "Password should be at least 6 characters"),
      password_confirmation: Yup.string().oneOf(
         [Yup.ref("password"), null],
         "Passwords must match"
      ),
   });

   return (
      <GuestMiddleware>
         <Head>
            <title>Register</title>
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
                  {
                     name: "password_confirmation",
                     type: "password",
                     placeholder: "Confirm password",
                  },
               ]}
               validationSchema={validationSchema}
               actionTitle="Register"
               onSubmit={handleRegister}
               secondaryActions={[
                  {
                     title: "Already subscribed ? Login here",
                     href: "/auth/login",
                  },
                  //   { title: "Forgot Password ?", href: "/" },
               ]}
               isSubmitting={isSubmitting}
            />
         </div>
      </GuestMiddleware>
   );
}
