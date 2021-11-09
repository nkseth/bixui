/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";

import styles from "../../styles/auth/Header.module.scss";

import logo from "../../public/logo.png";

const Header = () => {
   return (
      <div className={styles.container}>
         <img src={logo.src} alt="Logo" className={styles.logo} />
         <div className={styles.navContainer}>
            <NavItem title="Home" icon="fas fa-home-alt" link="/" />
         </div>
      </div>
   );
};

export default Header;

export const NavItem: React.FC<{ title: string; icon: string; link: string }> =
   ({ title, icon, link }) => {
      return (
         <Link href={link} passHref>
            <div className={styles.navItem}>
               <i className={icon} />
               <h4>{title}</h4>
            </div>
         </Link>
      );
   };
