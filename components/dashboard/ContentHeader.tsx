import React from "react";
import styles from "../../styles/dashboard/ContentHeader.module.scss";
import Button from "../Button";
import Stepper from "../Stepper";

type ContentHeaderPorps = {
   title?: string;
   actionButton?: React.ComponentProps<typeof Button>;
   secondaryButton?: React.ComponentProps<typeof Button>;
   stepperProps?: React.ComponentProps<typeof Stepper>;
};

const ContentHeader: React.FC<ContentHeaderPorps> = ({
   title,
   actionButton,
   secondaryButton,
   stepperProps,
}) => {
   return (
      <div className={styles.contentHeader}>
         <h2 className={styles.title}>{title ?? ""}</h2>
         {stepperProps && <Stepper {...stepperProps} />}
         <div className={styles.buttonsContainer}>
            {secondaryButton && <Button {...secondaryButton} />}
            {actionButton && <Button {...actionButton} />}
         </div>
      </div>
   );
};

export default ContentHeader;
