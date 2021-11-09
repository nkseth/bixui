import {
   Form,
   Formik,
   FormikConfig,
   FormikHelpers,
   FormikValues,
} from "formik";
import React, { useState } from "react";
import ContentHeader from "./dashboard/ContentHeader";

type FormikStepperPorps = FormikConfig<FormikValues>;

export const FormikStepper: React.FC<FormikStepperPorps> = ({
   children,
   ...props
}) => {
   const childrenArray = React.Children.toArray(
      children
   ) as React.ReactElement<FormikStepProps>[];

   //TODO: revert back to 0
   const [step, setStep] = useState(0);
   // const [completed, setCompleted] = useState(false);

   const currentChild = childrenArray[step];
   const isLastStep = step === childrenArray.length - 1;

   const handleSubmit = async (
      values: FormikValues,
      helpers: FormikHelpers<FormikValues>
   ) => {
      if (isLastStep) {
         await props.onSubmit(values, helpers);
         // setCompleted(true);
      } else {
         setStep((s) => s + 1);
         // helpers.setTouched({});
      }
   };

   return (
      <Formik
         {...props}
         validationSchema={currentChild.props.validationSchema}
         onSubmit={handleSubmit}
         isInitialValid={false}
         validateOnChange
         validateOnBlur
      >
         {({ isSubmitting, isValid }) => (
            <Form>
               <ContentHeader
                  title="Virtual booth"
                  actionButton={{
                     icon: isSubmitting
                        ? "fad fa-spinner-third fa-spin"
                        : "fas fa-chevron-right",
                     title: isLastStep ? "Create" : "Continue",
                     isIconRight: true,
                     disabled: !isValid || isSubmitting,
                     type: "submit",
                  }}
                  secondaryButton={{
                     icon: "fas fa-chevron-left",
                     title: "Go back",
                     disabled: isSubmitting || step === 0,
                     onClick: () => setStep((s) => s - 1),
                     type: "button",
                  }}
                  stepperProps={{
                     totalSteps: childrenArray.length,
                     currentStep: step + 1,
                     onClick: (step) => setStep(step),
                  }}
               />
               {currentChild}
            </Form>
         )}
      </Formik>
   );
};

type FormikStepProps = Pick<
   FormikConfig<FormikValues>,
   "children" | "validationSchema"
>;

export const FormikStep: React.FC<FormikStepProps> = ({ children }) => {
   return <>{children}</>;
};

export default FormikStepper;
