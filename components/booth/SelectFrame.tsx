/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";

import { Booth } from "../../constants/types";
import { IMAGES_URI } from "../../constants/variables";
import BoothContext from "../../context/BoothContext";
import Button from "../Button";

type SelectFramePorps = {
  selectedFrameIndex: number;
  setSelectedFrameIndex: React.Dispatch<React.SetStateAction<number>>;
  setCurrentStepIndex: React.Dispatch<React.SetStateAction<number>>;
};

const SelectFrame: React.FC<SelectFramePorps> = ({
  selectedFrameIndex,
  setSelectedFrameIndex,
  setCurrentStepIndex,
}) => {
  const booth = React.useContext(BoothContext) as Booth;

  return (
    <div className="frameSelectContainer">
      <img
        className="framePreview"
        alt="Selected frame"
        src={
          IMAGES_URI + booth.config.images.frames[selectedFrameIndex].filename
        }
      />

      <div className="framesContainer">
        {booth.config.images.frames.map(({ filename }, index) => (
          <img
            key={filename}
            alt="Frame"
            src={IMAGES_URI + filename}
            className={selectedFrameIndex === index ? "selected" : ""}
            onClick={() => setSelectedFrameIndex(index)}
          />
        ))}
      </div>
      <div className="buttonsContainer">
        <Button
          title="Go back"
          icon="fas fa-chevron-left"
          onClick={() => setCurrentStepIndex((s) => s - 1)}
        />
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

export default SelectFrame;
