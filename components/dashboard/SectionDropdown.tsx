import React, { useState } from "react";

import styles from "../../styles/dashboard/SectionDropdown.module.scss";

type SectionDropdownPorps = {
   initIsOpen?: boolean;
   title: string;
};

const SectionDropdown: React.FC<SectionDropdownPorps> = ({
   initIsOpen,
   title,
   children,
}) => {
   const [isOpen, setIsOpen] = useState<boolean>(!!initIsOpen);

   return (
      <div className={styles.container}>
         <div
            className={styles.titleContainer}
            onClick={() => setIsOpen((s) => !s)}
            style={{
               borderBottom: isOpen ? "1px solid rgba(0, 0, 0, 0.25)" : "none",
            }}
         >
            <p><b>{title}</b></p>
            <i className={`fas fa-chevron-${isOpen ? "down" : "left"}`} />
         </div>
         <div
            className={styles.contentContainer}
            style={{ display: isOpen ? "block" : "none" }}
         >
            {children}
         </div>
      </div>
   );
};

export default SectionDropdown;
