import { useRouter } from "next/router";
import React from "react";
import Swal from "sweetalert2";
import api from "../../constants/api";
import { BreadcrumbLocation } from "../../constants/types";
import { useStoreActions, useStoreState } from "../../hooks/store";
import styles from "../../styles/dashboard/Header.module.scss";

type HeaderProps = {
   location: BreadcrumbLocation[];
};

const Header: React.FC<HeaderProps> = ({ location }) => {
   const user = useStoreState((s) => s.user);
   const setAuthToken = useStoreActions((s) => s.setAuthToken);

   const router = useRouter();

   const handleLogout = async () => {
      const { isConfirmed } = await Swal.fire({
         title: "Are you sure you want to logout ?",
         icon: "question",
         showDenyButton: true,
         showConfirmButton: true,
         confirmButtonText: "Yes",
      });

      if (!isConfirmed) return;

      api.post("/logout").finally(() => {
         setAuthToken(null);
         router.push("/");
      });
   };

   return (
      <div className={styles.container}>
         <div className={styles.breadcrumbsContainer}>
            {location.map((item, index, items) => (
               <div key={item.title} className={styles.breadcrumbsItem}>
                  {item.title}
                  {index !== items.length - 1 && (
                     <i className="fas fa-chevron-right" />
                  )}
               </div>
            ))}
         </div>
         <div className={styles.userInfo}>
            {user?.email}
            <i className="fas fa-power-off" onClick={handleLogout} />
         </div>
      </div>
   );
};

export default Header;
