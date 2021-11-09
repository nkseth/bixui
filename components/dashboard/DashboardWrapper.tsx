import Sidebar from "./Sidebar";

import styles from "../../styles/dashboard/DashboardWrapper.module.scss";
import Header from "./Header";
import Button from "../Button";
import Stepper from "../Stepper";
import ContentHeader from "./ContentHeader";


type DashboardProps = {
   headerProps: React.ComponentProps<typeof Header>;
   contentHeaderProps?: React.ComponentProps<typeof ContentHeader>;
};

const DashboardWrapper: React.FC<DashboardProps> = ({
   headerProps,
   contentHeaderProps,
   children,
}) => {
   return (
      // <AuthMiddleware>
      <div className={styles.container}>
         <Sidebar />
         <div className={styles.contentContainer}>
            <Header {...headerProps} />
            {contentHeaderProps && <ContentHeader {...contentHeaderProps} />}
            {children}
         </div>
      </div>
      // </AuthMiddleware>
   );
};

export default DashboardWrapper;
