/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import { Draggable, Droppable } from "react-drag-and-drop";
import ReactDraggable from "react-draggable";
import Webcam from "react-webcam";
import { Booth } from "../../constants/types";
import { IMAGES_URI } from "../../constants/variables";
import BoothContext from "../../context/BoothContext";
import Button from "../Button";
import Spinner from "../Spinner";
import api from "../../constants/api";
import ProgressBar from "@ramonak/react-progress-bar";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { useStoreState } from "../../hooks/store";
import { getMergedImages } from "../../constants/helpers";

type CameraPorps = {
  selectedCameraType: "still" | "burst" | "gif";
  selectedFrameIndex: number;
  setCurrentStepIndex: React.Dispatch<React.SetStateAction<number>>;
};

const Camera: React.FC<CameraPorps> = ({
  selectedCameraType,
  selectedFrameIndex,
  setCurrentStepIndex,
}) => {
  const sticker = [
    "/sticker1.png",
    "/sticker2.png",
    "/sticker3.png",
    "/sticker4.png",
    "/sticker5.png",
    "/sticker6.png",
    "/sticker7.png",
    "/sticker8.png",
    "/sticker9.png",
    "/sticker10.png",
  ];
  const [stickers, setStickers] = useState<any[]>([]);
  const [offset, setOffset] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const frameImage: any = useRef();
  const frameImageWidth = frameImage?.current?.clientWidth || 0;
  const cameraContainerRef: any = useRef();
  const frameOffset = cameraContainerRef?.current?.getBoundingClientRect();
  const frameWidth = cameraContainerRef?.current?.offsetWidth;
  const frameHeight = cameraContainerRef?.current?.offsetHeight;
  const stickersRef: any = useRef(Array.from({length: stickers.length}, a => React.createRef()));

  const handleDrag = (e: any, index: number) => {
    const imageOffset = stickersRef?.current?.[index]?.getBoundingClientRect();
    const start = { x: imageOffset?.width || 90, y: imageOffset?.height || 20 };
    const position = {
      x: e.x - start.x - offset.left || 0,
      y: e.y - start.y - offset.top || 0,
    };
    setStickers((s) =>
      s.map((item, key) => {
        if (index === key) {
          return { ...item, x: position.x || 0, y: position.y || 0 };
        }
        return item;
      })
    );
  };

  const isDragDisabled = (index:any) => false;

  useEffect(() => {
    if (
      offset.top !== frameOffset?.top ||
      offset.left !== frameOffset?.left ||
      offset.width !== frameWidth ||
      height !== frameHeight
    ) {
      setOffset({
        top: frameOffset?.top || 0,
        left: frameOffset?.left || 0,
        width: frameWidth || 0,
        height: frameHeight || 0,
      });
    }
  }, [ offset.top, offset.left, offset.width, frameOffset, frameWidth, frameHeight]);

  const isBurst = selectedCameraType === "burst";
  const isStill = selectedCameraType === "still";
  const isGIF = selectedCameraType === "gif";

  const gifLength = (isBurst ? 2 : 1) * 500;
  const booth = React.useContext(BoothContext) as Booth;
  const { frames } = booth.config.images;
  const height = 480;
  const width = height * frames[selectedFrameIndex].aspectRatio;

  const [cameraIsLoaded, setCameraIsLoaded] = React.useState(false);
  const [capturedImages, setCapturedImages] = React.useState<string[]>([]);
  const [isCapturing, setisCapturing] = React.useState(false);
  const [currentPreviewImageIndex, setCurrentPreviewImageIndex] =
    React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  const router = useRouter();
  const user = useStoreState((s) => s.user);

  const webcamRef = React.useRef<Webcam | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(
    React.useCallback(() => {
      if (!capturedImages?.length) return;

      const nextFrameIndex = (old: number) => {
        return (old + 1) % (capturedImages.length * (isBurst ? 2 : 1));
      };

      const interval = setInterval(
        () => setCurrentPreviewImageIndex(nextFrameIndex),
        ((isBurst ? 2 : 1) * gifLength) / capturedImages.length
      );

      return () => {
        console.log("Clearing interval");
        clearInterval(interval);
      };
    }, [capturedImages.length, isBurst, gifLength]),
    [capturedImages]
  );

  const capturedImagePreviewIndex = () => {
    if (!capturedImages.length) return 1;

    const rest = currentPreviewImageIndex % capturedImages.length;

    if (!isBurst) return rest;

    if (currentPreviewImageIndex + 1 > capturedImages.length) {
      return capturedImages.length - rest - 1;
    } else {
      return rest;
    }
  };

  const handleCapture = async () => {
    setisCapturing(true);

    const framesCount = isStill ? 1 : isGIF ? 5 : 24;

    const images = [];

    for (let i = 0; i < framesCount; i++) {
      images.push(webcamRef.current?.getScreenshot() ?? "");
      framesCount !== 1 && (await _sleep(gifLength / framesCount));
    }

    setCapturedImages(images);

    setisCapturing(false);
  };

  const _sleep = async (ms: number) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), ms);
    });
  };

  const saveImage = async () => {
    const formdata = new FormData();

    formdata.append("isBurst", isBurst ? "true" : "false");

    const result = await Swal.fire({
      icon: "question",
      title: "Can we have your stunning photo in our Gallery ?",
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonText: "Yes, Please!",
      denyButtonText: "No, I'm too shy",
    });

    formdata.append("isPublic", result.isConfirmed ? "true" : "false");
    formdata.append(
      "aspectRatio",
      frames[selectedFrameIndex].aspectRatio.toString()
    );

    setIsUploading(true);

    const frame = new Image();
    frame.src = IMAGES_URI + frames[selectedFrameIndex].filename;
    frame.width = width;
    frame.height = height;
    frame.crossOrigin = "anonymous";

    await new Promise((resolve) => {
      frame.onload = () => resolve("Loaded");
    });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;

    const images = [];

    for (let i = 0; i < capturedImages.length; i++) {
      const image = new Image();
      image.width = width;
      image.height = height;
      image.src = capturedImages[i];

      await new Promise((resolve) => {
        image.onload = () => resolve("Loaded");
      });

      if (context) {
        context.drawImage(image, 0, 0, width, height);
        context.drawImage(frame, 0, 0, width, height);
      }

      images.push(canvas.toDataURL("image/jpeg", 0.7));
    }

    // todo - if free user true, else false
    // !user?.isOwner || !user?.isPaidUser
    const newImages = await handleMergeImages(
      images,
      width,
      height,
      !user?.isOwner
    );

    if (isStill) {
      formdata.append("image", newImages[0]);
    } else {
      newImages.forEach((image) => {
        formdata.append("images[]", image);
      });
    }

    const { data } = await api.post(
      `/booth/${booth.slug}/${isStill ? "saveImage" : "saveGIF"}`,
      formdata,
      {
        onUploadProgress: (e) =>
          setUploadProgress(Math.round((e.loaded * 100) / e.total)),
      }
    );

    router.push("/booth/" + booth.slug + "/gallery/" + data.filename);

    // setIsUploading(false);
    // setUploadProgress(0);
  };

  const handleMergeImages = async (
    images: string[],
    width: number,
    height: number,
    useWatermark?: boolean
  ) => {
    const watermarkWidth = 200;
    const watermarkHeight = 132;
    if (useWatermark) {
      const constructImages = images.map((image) => [
        ...[
          { src: image, x: 0, y: 0 },
          {
            src: "/logo_watermark.png",
            x: width - watermarkWidth - 60,
            y: height - watermarkHeight - 60,
          },
        ],
        ...stickers,
      ]);
      const mergedImages = await getMergedImages(constructImages);
      console.log({ constructImages, stickers, mergedImages });
      return mergedImages;
    }
    return images;
  };

  interface Sticker {
    src: string;
    x: boolean;
    y: boolean;
  }

  const stickerBox = () => {
    let box = document.querySelector("#stickerbox")!;
    box.classList.toggle("showbox");
  };
const addImage = () => {
  
}

  return (
    <div
      className="cameraContainer"
      ref={cameraContainerRef}
      style={{ width: frameImageWidth }}
    >
      {(!cameraIsLoaded || isUploading) && !uploadProgress && (
        <div className="spinnerContainer">
          <Spinner />
        </div>
      )}
      {isUploading ? (
        !!uploadProgress && (
          <div className="spinnerContainer">
            <ProgressBar completed={uploadProgress} width="300px" />
          </div>
        )
      ) : (
        <>
          <div className="videoPreviewContainer">
            <div
              style={{
                ...(uploadProgress && {
                  display: "none",
                }),
              }}
            >
              <Webcam
                style={{
                  ...((!cameraIsLoaded || capturedImages.length) && {
                    display: "none",
                  }),
                }}
                audio={false}
                className="videoPreview"
                screenshotQuality={1}
                videoConstraints={{
                  aspectRatio: frames[selectedFrameIndex].aspectRatio,
                }}
                ref={webcamRef}
                onPlay={() => setCameraIsLoaded(true)}
                  //onUserMedia={handleMediaStream}
              />
              {capturedImages.length ? (
                <img
                  src={capturedImages[capturedImagePreviewIndex()]}
                  alt="Frame"
                  className="videoPreview"
                />
              ) : null}
              <Droppable
                onDrop={(e: { sticker: string }) =>
                  setStickers((s) => [
                    ...s,
                    { src: e?.sticker || "", x: 0, y: 0 },
                  ])
                }
                types={["sticker"]}
                id="dBox"
              >
                <img
                  style={{ ...(!cameraIsLoaded && { display: "none" }) }}
                  src={IMAGES_URI + frames[selectedFrameIndex].filename}
                  alt="Frame"
                  className="videoPreview frame"
                  ref={frameImage}
                />
                <div className="sticker_container" id="sticker_container">
                  {stickers.map((item, index) => (
                    <ReactDraggable
                      key={index}
                      defaultPosition={{ x: 0, y: 0 }}
                      onDrag={(e) => handleDrag(e, index)}
                      disabled={isDragDisabled(index)}
                    >
                      <img src={item.src} alt={item.src} ref={stickersRef?.current?.[index]} />
                    </ReactDraggable>
                  ))}
                </div>
              </Droppable>
            </div>
          </div>
          <div className="buttonsContainer">
            <Button
              icon={
                "fas fa-" + (capturedImages.length ? "redo" : "chevron-left")
              }
              isRounded
              size={50}
              iconSize={18}
              onClick={
                capturedImages.length
                  ? () => setCapturedImages([])
                  : () => setCurrentStepIndex((s) => s - 1)
              }
              title={capturedImages.length ? "Retake" : "Go back"}
            />
            <Button iconSize={18} icon="fas fa-font" isRounded />
            <Button
              icon={`fas fa-${isCapturing ? "spinner fa-pulse" : "camera-alt"}`}
              isRounded
              size={70}
              iconSize={28}
              onClick={handleCapture}
              disabled={
                !!capturedImages.length || isCapturing || !cameraIsLoaded
              }
              title={capturedImages ? "Snap" : undefined}
            />
            <Button
              iconSize={18}
              isRounded
              icon="far fa-laugh-beam"
              onClick={() => stickerBox()}
            />
            <Button
              icon={
                "fas fa-" +
                (capturedImages.length ? "chevron-right" : "repeat-alt")
              }
              isRounded
              size={50}
              iconSize={18}
              title={capturedImages.length ? "Go next" : "Flip camera"}
              onClick={capturedImages.length ? saveImage : undefined}
            />
            <div className="sticker" id="stickerbox">
              {sticker.map((item, index) => (
                <Draggable  data={item} type="sticker" key={index}>
                  <img  onClick={()=>addImage()}src={item} alt={item} />
                </Draggable>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Camera;
