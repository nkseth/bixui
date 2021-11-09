import React from "react";
import FormWrapper from "../../FormWrapper";

import styles from "../../../../styles/dashboard/booth/new/BoothInfoForm.module.scss";
import {
   ErrorMessage,
   Field,
   FormikContextType,
   useFormikContext,
} from "formik";
import { BoothFormValues } from "../../../../pages/dashboard/booth/new";

type BoothPhrasesFormPorps = {};

const BoothPhrasesForm: React.FC<BoothPhrasesFormPorps> = ({}) => {
   const formik: FormikContextType<BoothFormValues> = useFormikContext();

   const fieldsTitles = ["Camera Select", "Frame Select", "Picture Snap"];

   return (
      <FormWrapper title="Extra">
         <div className={styles.formContainer}>
            <div className={styles.inputContainer}>
               <label htmlFor="">Add your event home page link</label>
               <Field name="event.url" placeHolder="https://www.example.com"/>
               <ErrorMessage
                  name="event.url"
                  className={styles.errorMessage}
                  component="div"
               />
               <div className={styles.message} style={{ marginBottom: 24 }}>
                  Leave it blank if you don&apos;t have a website
               </div>
            </div>
            <h3 style={{ textAlign: "center" }}>Phrases</h3>
            <p  style={{ textAlign: "center", color:"grey", padding:5 }}>Add your own title and subtitles</p>
            {formik.values.phrases.map((phrase, index) => (
               <>
                  <h4 style={{ marginTop: 8, marginBottom: 4 }}>
                     {fieldsTitles[index]}
                  </h4>
                  <div className={styles.inputsGroup} key={index}>
                     <div className={styles.inputContainer}>
                        <label htmlFor="">Title</label>
                        <Field name={`phrases.${index}.0`} />
                     </div>
                     <div className={styles.inputContainer}>
                        <label htmlFor="">Subtitle</label>
                        <Field name={`phrases.${index}.1`} />
                     </div>
                  </div>
                  <div
                     className={styles.inputsGroup}
                     style={{ marginTop: -16 }}
                  >
                     <div className={styles.inputContainer}>
                        <ErrorMessage
                           name={`phrases.${index}.0`}
                           className={styles.errorMessage}
                           component="div"
                        />
                     </div>
                     <div className={styles.inputContainer}>
                        <ErrorMessage
                           name={`phrases.${index}.1`}
                           className={styles.errorMessage}
                           component="div"
                        />
                     </div>
                  </div>
               </>
            ))}
         </div>
      </FormWrapper>
   );
};

export default BoothPhrasesForm;
