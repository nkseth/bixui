import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import BoothWrapper from "../../../components/booth/BoothWrapper";
import Camera from "../../../components/booth/Camera";
import SelectCameraType from "../../../components/booth/SelectCameraType";
import SelectFrame from "../../../components/booth/SelectFrame";
import Button from "../../../components/Button";
import api from "../../../constants/api";
import { isBoothActive } from "../../../constants/helpers";

import { Booth } from "../../../constants/types";
import { IMAGES_URI } from "../../../constants/variables";
import BoothContext from "../../../context/BoothContext";

export default function BoothIndex(
   props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
   const [currentStepIndex, setCurrentStepIndex] = useState(0);
   const [selectedFrameIndex, setSelectedFrameIndex] = useState(0);
   const [selectedCameraType, setSelectedCameraType] = useState<
      "still" | "burst" | "gif"
   >("still");

   const [title,settitle]=useState(props.config.phrases[currentStepIndex][0])
   const [subtitle,setsubtitle]=useState(props.config.phrases[currentStepIndex][1])
   const textchange=()=>{
         settitle("Decorate Your Photo")
         setsubtitle("Add Text and stickers")
   }

   const textchangeback=()=>{
      settitle(props.config.phrases[currentStepIndex][0])
      setsubtitle(props.config.phrases[currentStepIndex][1])
}

   const _steps = [
      <SelectCameraType
         key={0}
         {...{ selectedCameraType, setSelectedCameraType, setCurrentStepIndex }}
      />,
      <SelectFrame
         key={1}
         {...{ selectedFrameIndex, setSelectedFrameIndex, setCurrentStepIndex }}
      />,
      <Camera
         key={2}
        
         {...{ selectedCameraType, selectedFrameIndex, setCurrentStepIndex,textchange,textchangeback }}
      />,
   ];

   return (
      <BoothContext.Provider value={props}>
         <BoothWrapper booth={props}>
            <h3 className="title">
               {title}
            </h3>
            <h5 className="subTitle">
              {subtitle}
            </h5>
            {_steps[currentStepIndex] ?? null}
         </BoothWrapper>
      </BoothContext.Provider>
   );
}

export const getServerSideProps: GetServerSideProps<Booth> = async (
   context
) => {
   const { booth } = context.params as { booth: string };

   try {
      const { data } = await api.get(`/booth/${booth}`);
      

      if (!isBoothActive(data as Booth)) throw Error("Booth inactive");

      return {
         props: data,
      };
   } catch (err) {
      return {
         notFound: true,
      };
   }
};
