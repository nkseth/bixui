import React from "react";
import styles from "../styles/components/Stepper.module.scss";

type StepperPorps = {
   currentStep: number;
   totalSteps: number;
   onClick: (step: number) => void;
};

const Stepper: React.FC<StepperPorps> = ({ currentStep, totalSteps, onClick }) => {
   return (
      <div className={styles.container} style={{ maxWidth: totalSteps * 90 }}>
         {Array(totalSteps)
            .fill(0)
            .map((_, index) => (
               <React.Fragment key={index}>
                  <StepperStep
                     isCurrent={currentStep === index + 1}
                     isCompleted={currentStep > index + 1}
                     onClick={() => onClick(index)}
                  />
                  {index !== totalSteps - 1 && (
                     <div className={styles.stepLine} />
                  )}
               </React.Fragment>
            ))}
      </div>
   );
};

type StepperStepProps = {
   isCompleted: boolean;
   isCurrent: boolean;
   onClick: () => void;
};

const StepperStep: React.FC<StepperStepProps> = ({
   isCompleted,
   isCurrent,
   onClick
}) => {

   return (
      <div
         className={`${styles.stepContainer} ${
            isCompleted && styles.completed
         }`}
         onClick={onClick}
      >
         {isCompleted && <i className="far fa-check" />}
         {isCurrent && <div className={styles.currentStepContainerDot} />}
      </div>
   );
};

export default Stepper;
