import React, { useEffect, useState } from "react";

import FormWrapper from "../../FormWrapper";
import SectionDropdown from "../../SectionDropdown";

import styles from "../../../../styles/dashboard/booth/new/BoothSettingsForm.module.scss";
import { Field, FormikContextType, useFormikContext } from "formik";
import { BoothFormValues } from "../../../../pages/dashboard/booth/new";

type BoothSettingsFormPorps = {};

const BoothSettingsForm: React.FC<BoothSettingsFormPorps> = ({}) => {
   const formik: FormikContextType<{
      cameras: { readonly [key: string]: boolean };
      sharing: { readonly [key: string]: boolean };
   }> = useFormikContext();

   useEffect(() => {
      formik.validateForm();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return (
      <FormWrapper title="Config">
         <SectionDropdown title="PHOTO MODES" initIsOpen>
            <div className={styles.checkBoxesContainer}>
               {Object.keys(formik.values.cameras).map((key) => (
                  <Checkbox
                     key={key}
                     label={key}
                     name={"cameras." + key}
                     // initialValue={formik.values.cameras[key]}
                  />
               ))}
            </div>
         </SectionDropdown>
         <SectionDropdown title="Sharing" initIsOpen>
            <div className={styles.checkBoxesContainer}>
               {Object.keys(formik.values.sharing).map((key) => {
                  return (
                     <Checkbox
                        key={key}
                        label={key}
                        name={"sharing." + key}
                        initialValue={formik.values.sharing[key]}
                        // disabled={!formik.values.sharing[key]}
                     />
                  );
               })}
            </div>
         </SectionDropdown>
      </FormWrapper>
   );
};

type CheckboxPorps = {
   label: string;
   name?: string;
   disabled?: boolean;
   onChange?: (val: boolean) => void;
   initialValue?: boolean;
};

export const Checkbox: React.FC<CheckboxPorps> = ({
   label,
   onChange,
   disabled,
   name,
   initialValue,
}) => {
   const [isChecked, setIsChecked] = useState(!!initialValue);

   return (
      <div className={styles.checkBoxContainer}>
         <Field
            type="checkbox"
            // checked={plat.initSelected}
            id={label + "efee"}
            name={name}
            // onChange={() => {
            //    setIsChecked((v) => !v);
            //    onChange && onChange(isChecked);
            // }}
            disabled={disabled}
            initialValue={initialValue}
         />
         <label htmlFor={label + "efee"}>{label}</label>
      </div>
   );
};

export default BoothSettingsForm;
