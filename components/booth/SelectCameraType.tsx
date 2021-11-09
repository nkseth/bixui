import React, { useState } from "react";
import { Booth } from "../../constants/types";
import BoothContext from "../../context/BoothContext";
import Button from "../Button";

type CameraSelectorProps = {
   name: string;
   description: string;
   icon: string;
   onSelect: () => void;
   selected: boolean;
};

const CameraSelector: React.FC<CameraSelectorProps> = ({
   name,
   description,
   icon,
   selected,
   onSelect,
}) => {
   return (
      <div
         className={"typeContainer " + (selected && "selected")}
         onClick={onSelect}
      >
         <div className="icon">
            <i className={"fas fa-" + icon} />
         </div>
         <div className="divider" />
         <div className="info">
            <h3>{name}</h3>
            <h4>{description}</h4>
         </div>
      </div>
   );
};

type SelectCameraTypePorps = {
   selectedCameraType: "still" | "burst" | "gif";
   setSelectedCameraType: React.Dispatch<
      React.SetStateAction<"still" | "burst" | "gif">
   >;
   setCurrentStepIndex: React.Dispatch<React.SetStateAction<number>>;
};

const SelectCameraType: React.FC<SelectCameraTypePorps> = ({
   selectedCameraType,
   setSelectedCameraType,
   setCurrentStepIndex,
}) => {
   const { config } = React.useContext(BoothContext) as Booth;
   const { cameras } = config;

   return (
      <div className="cameraTypeSelect">
         <div className="selectsContainer">
            {cameras.still && (
               <CameraSelector
                  name="Still"
                  description="Captures a single photo"
                  icon="camera-alt"
                  onSelect={() => setSelectedCameraType("still")}
                  selected={selectedCameraType === "still"}
               />
            )}
            {cameras.gif && (
               <CameraSelector
                  name="GIF"
                  description="A set of photos will be taken and converted into GIF"
                  icon="stopwatch"
                  onSelect={() => setSelectedCameraType("gif")}
                  selected={selectedCameraType === "gif"}
               />
            )}
            {cameras.burst && (
               <CameraSelector
                  name="Burst"
                  description="A burst/boomerang series will be taken. Ready for action?"
                  icon="video"
                  onSelect={() => setSelectedCameraType("burst")}
                  selected={selectedCameraType === "burst"}
               />
            )}
         </div>
         <div className="buttonsContainer">
            {/* <Button title="Go back" icon="fas fa-chevron-left" disabled /> */}
            <Button
               title="Continue"
               icon="fas fa-chevron-right"
               isIconRight
               onClick={() => setCurrentStepIndex((s) => s + 1)}
            />
         </div>
      </div>
   );
};

export default SelectCameraType;
