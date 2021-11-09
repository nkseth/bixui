import React, { useState } from "react";
import Link from "next/link";
import Image from 'next/image';
import styles from "../../styles/dashboard/Sidebar.module.scss";
import { useRouter } from "next/router";
import { useStoreState } from "../../hooks/store";
import logo from '../../public/logo.png';

const Sidebar = () => {
   const user = useStoreState((s) => s.user);

   return (
      <div className={styles.container}>
         <div className={styles.logo}><Image src={logo} alt="BizConnect Events logo"/></div>
         {user?.isOwner ? (
            <NavItem
               title="Admin"
               icon="fas fa-users-crown"
               dropdown={[
                  { title: "Users", to: "/dashboard/admin/users" },
                  { title: "Booths", to: "/dashboard/admin/booths" },
               ]}

            />
         ) : null}
         {user?.isOwner ? (
            <NavItem 
               title="Events" 
               icon="fas fa-calendar" 
            />
         ):null}
         <NavItem
            title="Selfie Booth"
            icon="fas fa-person-booth"
            dropdown={[
               { title: "All", to: "/dashboard/booth/all" },
               { title: "Create", to: "/dashboard/booth/new" },
            ]}
         />
         <NavItem
            title="Gallery"
            icon="fas fa-image"
            to="/dashboard/gallery"
         /> 
         <NavItem 
            title="Templates" 
            icon="fas fa-expand"
            to="/dashboard/template"
         />
         {user?.isOwner ? (
            <NavItem
               title="Reports"
               icon="far fa-file-alt"
               to="/dashboard/reports"
            />
         ):null}
         {user?.isOwner ? (
            <NavItem
               title="Settings"
               icon="fas fa-cog"
               to="/dashboard/settings"
         />):null}
         
      </div>
   );
};

type NavItemProps = {
   title: string;
   icon: string;
   to?: string;
   dropdown?: { title: string; to: string }[];
   disabled?: boolean;
   initIsOpen?: boolean;
};

const NavItem: React.FC<NavItemProps> = ({
   icon,
   title,
   to,
   dropdown,
   disabled,
   initIsOpen,
}) => {
   const [isOpen, setIsOpen] = useState<boolean>(!!initIsOpen);

   const router = useRouter();

   const handleClick = () => {
      if (disabled) return;

      if (!dropdown) {
         to && router.push(to);
         return;
      }

      setIsOpen((val) => !val);
   };

   return (
      <>
         <div
            className={`${styles.navItem} ${disabled && styles.disabled}`}
            onClick={handleClick}
         >
            <div>
               <i className={icon} />
            </div>
            {title}
            {dropdown && (
               <div className={isOpen ? styles.flipped : undefined}>
                  <i className="fas fa-chevron-down" />
               </div>
            )}
         </div>
         {!disabled && dropdown && (
            <div
               className={`${styles.navItemDropdown} ${isOpen && styles.open}`}
            >
               {dropdown.map((item) => (
                  <Link key={item.title} href={item.to} passHref>
                     <div>{item.title}</div>
                  </Link>
               ))}
            </div>
         )}
      </>
   );
};

export default Sidebar;
