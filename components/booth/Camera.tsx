/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
/* @ts-ignore*/
// @ts-nocheck
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
import moment from "moment";
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react'
import { fabric } from 'fabric-pure-browser'

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
  const { editor, onReady } = useFabricJSEditor()
  



 

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

  const [addtext,setaddtext]=useState(false);

  const router = useRouter();
  const user = useStoreState((s) => {console.log("adfasdfsadsadsds",s); return s.user });

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

    const images:any = [];

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

    const images:any = [];

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
      user?.isOwner
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


  
  const saveImage2 = async (img:any) => {
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
    const imag:any=[]
    imag.push(img)
    const newImages = await handleMergeImages(
      imag,
      width,
      height,
      user?.isOwner
    );
debugger
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

React.useEffect(()=>{
  console.log(window.location.href)
  },[user])

  const handleMergeImages = async (
    images: string[],
    width: number,
    height: number,
    isowner?: boolean
  ) => {

    const watermarkWidth = 200;
    const watermarkHeight = 132;
    console.log(moment(booth.starts_at).diff(moment(),'seconds')<0)
    if ( isowner?moment(booth.starts_at).diff(moment(),'seconds')<0:true ) {
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



const [imagew,setimgw]=useState({clientWidth:0,clientHeight:0})

useEffect(() => {


  fabric.Image.fromURL(capturedImages[capturedImagePreviewIndex()], function(oImg) { 
     console.log("wogoo",oImg)
    editor?.canvas.add( oImg.set({selectable:false,crossOrigin:"anonymous"}) );
   editor?.canvas.renderAll()
  
  
  },{ crossOrigin: 'Anonymous' })


   fabric.Image.fromURL(IMAGES_URI + frames[selectedFrameIndex].filename, function(oImg) {  

      if(imagew?.clientWidth<250){
        editor?.canvas.add( oImg.set({left: 0, top: 0,selectable:false,crossOrigin:"anonymous"}).scale(0.25));
      }
      else{
        editor?.canvas.add( oImg.set({left: 0, top: 0,selectable:false,crossOrigin:"anonymous"}).scale(0.37));  
      }
      
      editor?.canvas.renderAll()
  },{ crossOrigin: 'Anonymous' })
  

},[ capturedImages])

const savecanvas=()=>{

  console.log("this is blob",editor?.canvas)
   // console.log(blob);
     console.log(editor?.canvas.toDataURL({format: 'png'}))
    // console.log(URL.createObjectURL(blob))
    if ( true )
    {
      fabric.Image.fromURL(IMAGES_URI + frames[selectedFrameIndex].filename, function(oImg) {  

        
          editor?.canvas.add( oImg.set({left:0, top: -100,selectable:false, width:200,height:132}));
  
        
        editor?.canvas.renderAll()
    },{ crossOrigin: 'Anonymous' })
    }


    const url:any = editor?.canvas.toDataURL({format: 'png'})
    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "File name",{ type: "image/png" })
        console.log(file)
        saveImage2(url)
      })

  
    }





const addsticker=(imgurl:any) => {
  
 
    fabric.Image.fromURL(imgurl, function(oImg) { 
      // oImg._originalElement.crossOrigin="anonymous"
      editor?.canvas.add( oImg.set({left: 0, top: 0}).scale(0.7));
      
  },{ crossOrigin: 'Anonymous' })


}

const atttextcanvas=()=>{
  editor?.canvas.add(new fabric.Text(textvalue, { 
    left: 10, //Take the block's position
    top: 10, 
    fill:textcolor
    
}));
}

const funi=()=>{
  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.cornerColor = 'blue';
  fabric.Object.prototype.cornerStyle = 'circle';
 let img = document.getElementById('imageid');
 img? setimgw(img):null 

//or however you get a handle to the IMG
        var width = img?.clientWidth;
        var height = img?.clientHeight;
      alert(width + ' x ' + height + '')
        editor?.canvas.setDimensions({width:width|| 0, height:height||0});
}

const [textcolor,settextcolor]=useState("#000ff")
const [textvalue,settextvalue]=useState("")
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

<div 

 style={{ ...((!cameraIsLoaded || capturedImages.length) && { zIndex: 1000 }),width:imagew?.clientWidth,
height:imagew?.clientHeight
}}
 
 >
  <FabricJSCanvas className="sample-canvas" onReady={onReady} />
</div>
              
              
                             {capturedImages.length ? (
             
               <img
                  src={capturedImages[capturedImagePreviewIndex()]}
                  alt="Frame"
                  className="videoPreview"
                style={{ ...((!cameraIsLoaded || capturedImages.length) && { zIndex: -1000 }) }}
                /> 
             ) : null}
             <img id="imageid"
                  style={{ ...((!cameraIsLoaded || capturedImages.length) && { zIndex: -1000 }) }}
                  src={IMAGES_URI + frames[selectedFrameIndex].filename}
                  alt="Frame"
                  className="videoPreview frame"
                  ref={frameImage}
                /> 
                <div className="sticker_container" id="sticker_container">
                  {stickers.map((item, index) => 
                    
                      <img src={item.src} alt={item.src} ref={stickersRef?.current?.[index]} />
                   
                  )}
                </div>
             
            </div>
          </div>
          <div style={{display:'flex',justifyContent: 'center',flexDirection:'column',alignContent:'center'}}>
          <div className="buttonsContainer" style={{backgroundColor:'red',width:'100%',marginLeft:'-3vw'}} >
            <Button
              icon={
                "fas fa-" + (capturedImages.length ? "redo" : "chevron-left")
              }
              isRounded
              size={50}
              iconSize={18}
              onClick={
                capturedImages.length
                  ? () =>{ setCapturedImages([])
                    let obi:any=editor?.canvas.getObjects()
                    obi.map((item:any)=>{
                      debugger
                      editor?.canvas.remove(item)
                    })
                    editor?.canvas.clear()
                  }
                  : () => {setCurrentStepIndex((s) => s - 1);
                    }
              }
              title={capturedImages.length ? "Retake" : "Go back"}
            />
            <Button iconSize={18}  onClick={()=>{setaddtext(true)}} icon="fas fa-font" isRounded 
             disabled={
              !capturedImages.length
            }
            />
            <Button
              icon={`fas fa-${isCapturing ? "spinner fa-pulse" : "camera-alt"}`}
              isRounded
              size={70}
              iconSize={28}
              onClick={()=>{handleCapture();funi()}}
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
              disabled={
                !capturedImages.length
              }
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
              onClick={capturedImages.length ? savecanvas : undefined}
            />
            <div className="sticker" id="stickerbox">
              {sticker.map((item, index) => (
           
                  <img  key={index} onClick={()=>addsticker(item)}src={item} alt={item} />
              
              ))}
            </div>
         

           
          </div>
        
          <div style={{backgroundColor:'green'}}>
              <button
              disabled={editor?.canvas.getActiveObject()?false:true}
              style={{color:'white',fontSize:"15px",padding:'5px 7px'
              ,backgroundColor:'blue',border:"none"}}
              onClick={()=>{
                   var object = editor?.canvas.getActiveObject();
                   console.log(object)
                   if (!object){
                       alert('Please select the element to remove');
                       return '';
                   }
                   editor?.canvas.remove(object);

              }}>Remove selected image Image</button>
            </div>
            
            {addtext?<div style={{display:'flex'}}>
              <input onChange={(e)=>{settextvalue(e.target.value)}} value={textvalue}>
            </input>
            <label >Color Picker:</label>
            <input type="color" id="colorpicker" value={textcolor} onChange={(e)=>{settextcolor(e.target.value)}}/>
            <button onClick={()=>{atttextcanvas()}}>Add text</button>
            </div>:null}
           
            
          </div>

       
        </>

        
      )}
     
    </div>
  );
};

export default Camera;
