import Link from "next/link";
import {
   Formik,
   Field,
   FormikHelpers,
   ErrorMessage,
   Form as FormikForm,
} from "formik";

import styles from "../../styles/auth/Form.module.scss";
import { useEffect, useState } from "react";

type Input = {
   name: string;
   type?: string;
   placeholder: string;
   initialValue?: string;
};

type SecondaryAction = { title: string; href: string };

type FormProps = {
   title: string;
   inputs: Input[];
   actionTitle: string;
   secondaryActions?: SecondaryAction[];
   validationSchema: any;
   onSubmit: (values: any, formikHelpers: FormikHelpers<any>) => void;
   isSubmitting: boolean;
};

const Form: React.FC<FormProps> = ({
   title,
   inputs,
   actionTitle,
   secondaryActions,
   validationSchema,
   onSubmit,
   isSubmitting,
}) => {
   //
   const parseInitialValues = (inputs: Input[]) => {
      const values = {} as any;
      inputs.forEach((input) => {
         values[input.name] = input.initialValue ?? "";
      });
      return values;
   };

   return (
      <div className={styles.container}>
         <h3 className={styles.title}>{title}</h3>
         <Formik
            initialValues={parseInitialValues(inputs)}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
         >
            {({ errors, touched }) => {
               return (
                  <FormikForm>
                     {inputs.map((input, index) => (
                        <>
                           <Field
                              type={input.type ?? "text"}
                              name={input.name}
                              placeholder={input.placeholder}
                              key={`${index} input`}
                              className={`${styles.input} ${
                                 touched[input.name] &&
                                 errors[input.name] &&
                                 styles.errorInput
                              }`}
                           />
                           <ErrorMessage
                              name={input.name}
                              component="h4"
                              className={styles.error}
                              key={`${index} error`}
                           />
                        </>
                     ))}
                     <button
                        className={styles.button}
                        type="submit"
                        disabled={isSubmitting}
                     >
                        {isSubmitting ? (
                           <i className="fad fa-spinner-third fa-spin" />
                        ) : (
                           actionTitle
                        )}
                     </button>
                  </FormikForm>
               );
            }}
         </Formik>
         {secondaryActions?.map(({ href, title }, index) => (
            <Link href={href} passHref key={`${index} action`}>
               <button className={styles.buttonSecondary}>{title}</button>
            </Link>
         ))}
         {/* <form onSubmit={handleSubmit}>
            {inputs.map((input, index) => (
               <input
                  type={input.type ?? "text"}
                  className={styles.input}
                  placeholder={input.placeholder}
                  onChange={input.onchange}
                  key={index}
               />
            ))}
            <button className={styles.button}>{actionTitle}</button>
         </form> */}
      </div>
   );
};

export default Form;
