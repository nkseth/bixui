import React from "react";

import styles from "../../styles/dashboard/FormWrapper.module.scss";

type FormWrapperPorps = {
   title: any;
   divider?: boolean;
};

const FormWrapper: React.FC<FormWrapperPorps> = ({
   title,
   divider,
   children,
}) => {
   return (
      <div className={styles.container}>
         <div className={styles.title}>{title}</div>
         {divider && <div className={styles.splitter} />}
         {children}
      </div>
   );
};

export default FormWrapper;
