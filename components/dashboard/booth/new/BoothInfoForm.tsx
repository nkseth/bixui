import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikContextType,
  useFormikContext,
} from "formik";
import * as Yup from "yup";
import React, { useRef } from "react";
import { useStoreState } from "../../../../hooks/store";
import styles from "../../../../styles/dashboard/booth/new/BoothInfoForm.module.scss";
import FormWrapper from "../../FormWrapper";
import { BoothFormValues } from "../../../../pages/dashboard/booth/new";
import { futureDate } from "../../../../constants/helpers";

type BoothInfoFormPorps = {};

const BoothInfoForm: React.FC<BoothInfoFormPorps> = ({}) => {
  const formik: FormikContextType<BoothFormValues> = useFormikContext();

  const parseDate = (date: Date, count = 0) => {
    const r = [];
    const newDate = futureDate(date, count);
    const parts = newDate.toISOString().split("T");

    r[0] = parts[0];

    r[1] = parts[1]
      .split(":")
      .filter((_, i) => i <= 1)
      .join(":");

    r[2] = parts[1];

    return r;
  };

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isStart: boolean,
    isTime?: boolean
  ) => {
    const oldValue = new Date(
      formik.values.event[isStart ? "startDate" : "endDate"]
    );

    console.log(parseDate(oldValue)[0] + " " + e.target.value);

    const date = new Date(e.target.value);

    var newValue: Date;

    if (!isTime) {
      newValue = new Date(
        Date.parse(parseDate(date)[0] + "T" + parseDate(oldValue)[2])
      );
    } else {
      newValue = new Date(parseDate(oldValue)[0] + " " + e.target.value);
    }

    formik.setFieldValue(
      "event." + (isStart ? "startDate" : "endDate"),
      newValue
    );
  };

  const user = useStoreState((s) => s.user);
  return (
    <FormWrapper title="General">
      <div className={styles.formContainer}>
        <div className={styles.inputContainer}>
          <label htmlFor="">Event Name</label>
          <Field name="event.title" placeholder="Choose your event name" />
          <ErrorMessage
            name="event.title"
            className={styles.errorMessage}
            component="div"
          />
        </div>
        <div className={styles.inputsGroup}>
          <div className={styles.inputContainer}>
            <label htmlFor="">Start Date</label>
            <input
              type="date"
          
              value={parseDate(formik.values.event.startDate)[0]}
              onChange={(e) => handleDateChange(e, true, false)}
            />
          </div>
          <div className={`${styles.inputContainer} ${styles.smaller}`}>
            <label htmlFor="">Start Time</label>
            <input
              type="time"
              value={parseDate(formik.values.event.startDate)[1]}
              onChange={(e) => handleDateChange(e, true, true)}
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="">End Date</label>
            {user?.isOwner ? (
               <input
               type="date"
               min={parseDate(formik.values.event.startDate)[0]}
               value={parseDate(formik.values.event.endDate)[0]}
               onChange={(e) => handleDateChange(e, false, false)}
             />
            ) : 
               <input
               type="date"
               min={parseDate(formik.values.event.startDate)[0]}
               max={parseDate(formik.values.event.startDate, 7)[0]}
               value={parseDate(formik.values.event.endDate)[0]}
               onChange={(e) => handleDateChange(e, false, false)}
               /> 
            } 
            
          </div>
          <div className={`${styles.inputContainer} ${styles.smaller}`}>
            <label htmlFor="">End Time</label>
            <input
              type="time"
              value={parseDate(formik.values.event.endDate)[1]}
              onChange={(e) => handleDateChange(e, false, true)}
            />
          </div>
        </div>
        <div className={styles.inputsGroup} style={{ marginTop: -16 }}>
          <div className={styles.inputContainer}>
            <ErrorMessage
              name="event.startDate"
              className={styles.errorMessage}
              component="div"
            />
          </div>
          <div className={`${styles.inputContainer} ${styles.smaller}`} />
          <div className={styles.inputContainer}>
            <ErrorMessage
              name="event.endDate"
              className={styles.errorMessage}
              component="div"
            />
          </div>
          <div className={`${styles.inputContainer} ${styles.smaller}`} />
        </div>
        <div className={styles.inputsGroup}>
          {user?.isOwner ? (
            <div className={styles.inputContainer}>
              <label htmlFor="">Custom Domain</label>
              <Field name="_" disabled as="select">
                <option selected>Select...</option>
              </Field>
            </div>
          ) : null}
          <div className={styles.inputContainer}>
            <label htmlFor="">Slug (www.bizconnectevents.com/slug)</label>
            <Field
              name="event.slug"
              placeholder="Choose your event name as slug, Min 6 characters"
            />
          </div>
        </div>
        <div
          className={styles.inputsGroup}
          style={{ marginTop: -16, marginBottom: 16 }}
        >
          <div className={styles.inputContainer}>
            <div className={styles.message}></div>
          </div>
          <div className={styles.inputContainer}>
            <ErrorMessage
              name="event.slug"
              className={styles.errorMessage}
              component="div"
            />
          </div>
        </div>
        {user?.isOwner ? (
          <div className={styles.inputContainer}>
            <label htmlFor="">Users with access</label>
            <Field name="_" disabled as="select">
              <option selected>Select...</option>
            </Field>
          </div>
        ) : null}
      </div>
    </FormWrapper>
  );
};

export default BoothInfoForm;
