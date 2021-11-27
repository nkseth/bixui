/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Link from "next/link";
import React from "react";
import { Booth } from "../../constants/types";
import { IMAGES_URI } from "../../constants/variables";
import Button from "../Button";

type BoothWrapperPorps = { booth: Booth };

const BoothWrapper: React.FC<BoothWrapperPorps> = ({ booth, children }) => {
   const { config } = booth;

   const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

   return (
      <div
         className="boothContainer"
         style={{
            backgroundColor: config.colors.background,
            color: config.colors.text,
            ...(config.images.background && {
               backgroundImage: `url(${IMAGES_URI + config.images.background})`,
            }),
         }}
      >

         {config.images.logo?<div style={{position:'absolute',right:'20px',top:"50px"}}>
         <img src={IMAGES_URI + config.images.logo} alt="logo" style={{maxWidth:'200px'}}/>
         </div>:null}
         <div className={"sidebarButton " + (isSidebarOpen && "hidden")}>
            <Button
               icon="far fa-bars"
               size={50}
               onClick={() => setIsSidebarOpen(true)}
            />
         </div>
         <div className={"sidebarContainer " + (isSidebarOpen && "open")}>
            <div
               className="closeButton"
               onClick={() => setIsSidebarOpen(false)}
            >
               <i className="fas fa-times" />
            </div>
            <SidebarItem
               href={"/booth/" + booth.slug}
               icon="fas fa-home-lg-alt"
               title="Home"
            />
            <SidebarItem
               href={"/booth/" + booth.slug + "/gallery"}
               icon="fas fa-images"
               title="Gallery"
            />
            {booth.config.event && (
               <SidebarItem
                  href={booth.config.event}
                  target="_blank"
                  rel="noreferrer"
                  icon="fas fa-globe"
                  title="Event"
               />
            )}
            {/* <SidebarItem
               href={"/booth/" + booth.slug}
               icon="fas fa-home-lg-alt"
               title="Home"
            /> */}
         </div>
         {children}
         
      </div>
   );
};

type SidebarItemPorps = {
   icon: string;
   title: string;
} & React.DetailedHTMLProps<
   React.AnchorHTMLAttributes<HTMLAnchorElement>,
   HTMLAnchorElement
>;

const SidebarItem: React.FC<SidebarItemPorps> = ({ icon, title, ...props }) => {
   return (
      <a {...props}>
         <i className={icon} /> {title}
      </a>
   );
};

export default BoothWrapper;
