import React from "react";

import styles from "../styles/components/Button.module.scss";

type ButtonProps = {
   title?: string;
   icon?: string;
   isIconRight?: boolean;
   disabled?: boolean;
   type?: "button" | "submit" | "reset";
   isRounded?: boolean;
   size?: number;
   iconSize?: number;
} & React.HTMLProps<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({
   icon,
   title,
   isIconRight,
   disabled,
   type,
   isRounded,
   size,
   iconSize,
   style,
   ...props
}) => {
   return (
      <button
         {...props}
         className={`${styles.button} ${isRounded && styles.rounded}`}
         {...isIconRight? null:{...{ disabled }}}
         type={type}
         style={{
            ...style,
            ...(size !== undefined && {
               width: size,
               height: size,
               padding: 0,
            }),
         }}
      >
         {!isIconRight && icon && (
            <i
               className={icon}
               style={{
                  ...(iconSize !== undefined && {
                     fontSize: iconSize,
                  }),
                  ...(!title && {
                     marginRight: 0,
                  }),
               }}
            />
         )}
         {!isRounded && title}
         {!isRounded && isIconRight && icon && (
            <i className={`${icon} ${styles.rightIcon}`} />
         )}
      </button>
   );
};

export default Button;
