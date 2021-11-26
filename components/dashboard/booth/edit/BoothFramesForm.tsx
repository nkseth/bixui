/* eslint-disable @next/next/no-img-element */
import { ErrorMessage, FormikContextType, useFormikContext } from "formik";
import React, { useEffect, useRef, useState } from "react";
import swal from "sweetalert2";
import { Frame } from "../../../../constants/types";
import { APP_URI, IMAGES_URI } from "../../../../constants/variables";
import { BoothFormValues } from "../../../../pages/dashboard/booth/new";
import styles from "../../../../styles/dashboard/booth/new/BoothFramesForm.module.scss";
import FileDropArea from "../../../FileDropArea";
import FormWrapper from "../../FormWrapper";
import { useStoreState } from "../../../../hooks/store";
type BoothFramesFormPorps = {};

const BoothFramesForm: React.FC<BoothFramesFormPorps> = ({}) => {
  const MAX_IMAGES = 5;
  const [newselectedimage,setnewselected]=useState([])
  const formik: FormikContextType<BoothFormValues> = useFormikContext();

  const [images, setImages] =useState<any[]>(formik.values.images.frames);
console.log(formik.values.images.frames)
  const canUploadMore = images.length < MAX_IMAGES;
 // const user = useStoreState((s) => {console.log("adfasdfsadsadsds",s); return s.user });

  const handleFilesList = (files: FileList) => {
    for (let i = 0; i < files.length; i++) addImage(files.item(i) as File);
  };

  const addImage = async (file: File) => {
    if (file.type === "image/png") {
      setImages((images) => [...images, file]);
    }
  };
//const [newset,setnewset]=useState([])

  useEffect(()=>{
    formik.setFieldValue("images.frames",images );
  },[images])

 

  const handleImageDelete = (image: File | Frame) => {
    swal
      .fire({
        title: "Delete frame ?",
        icon: "warning",
        confirmButtonText: "Delete",
        denyButtonText: "Cancel",
        showConfirmButton: true,
        showDenyButton: true,
      })
      .then(() => {
        debugger
        const heep=[]
        images.map((item)=>{
          if(item?.name!==image?.name || image?.filename!==item?.filename)  heep.push(item)
        })
        formik.setFieldValue("images.frames",heep );
        setImages(heep);
      });
  };

//   const imageconvertor=async(url:any,name:any)=>{
 
//     const toDataURL = async(url:any) => await fetch(url)
//           .then(response => response.blob())
//           .then(blob => new Promise((resolve, reject) => {
//           const reader = new FileReader()
//           reader.onloadend = () => resolve(reader.result)
//           reader.onerror = reject
//           reader.readAsDataURL(blob)
//          }))
    
//          function dataURLtoFile(dataurl:any, filename:any) {
         
//           var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
//           bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
//           while(n--){
//           u8arr[n] = bstr.charCodeAt(n);
//           }
//         return new File([u8arr], filename, {type:mime});
//        }
//  const data= await toDataURL(url) 

// return dataURLtoFile(data,name)

//   }

 
//   useEffect(() => {
//     const img=[]
//     Promise.all(images?.map(async (item)=>{

//         const imageobb=  await imageconvertor(`${IMAGES_URI+item.filename}`,item.filename)

//         img.push(imageobb)
    
//      return img
     
//     })).then((result)=>{
//       setnewset(result)
//       console.log("this is result",result)
//     })
// // if(images.length>0) formik.setFieldValue("images.frames", img);
    
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [images]);



  const allFrames = [
    "/frame1.png",
    "/frame2.png",
    "/frame3.png",
    "/frame4.png",
    "/frame5.png",
  ].map((item) => APP_URI + item);

;



  const selectedimageclick=async(url:any,name:any)=>{
 
    const toDataURL = async(url:any) => await fetch(url)
          .then(response => response.blob())
          .then(blob => new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(blob)
         }))
    
         function dataURLtoFile(dataurl:any, filename:any) {
         
          var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
          while(n--){
          u8arr[n] = bstr.charCodeAt(n);
          }
        return new File([u8arr], filename, {type:mime});
       }
 const data= await toDataURL(url) 

 addImage(dataURLtoFile(data,name))

  }

 
  return (
    <>
      <FormWrapper
        title={
          <>
            <p>Picture frames</p>
            <span>
              {images.length} / {MAX_IMAGES}
            </span>
          </>
        }
      >
        <p style={{ color: "grey", padding: "5px 0" }}>
          <small>
            Please use transparent PNG image with Min 1000 x 1000 resolution,
            refer below for example.
          </small>
        </p>
        <div className={styles.previewsContainer}>
          
          {images.map((image, i) => (
            <div
              key={
                (image?.filename ? image?.filename : image?.lastModified) + "" + i
              }
              className={styles.previewContainer}
              onClick={() => handleImageDelete(image)}
            >
              <img
                alt={image?.filename ? image?.filename : image?.name}
                src={
                  image?.filename
                    ? IMAGES_URI + image?.filename
                    : URL?.createObjectURL(image)
                }
              />
              <div className={styles.deleteImageHover}>
                <i className="fas fa-trash-alt" />
              </div>
            </div>
          ))}

          {canUploadMore && (
            <FileDropArea
              onUpload={handleFilesList}
              style={{ width: 191 }}
              allowed={["image/png"]}
              multiple
            />
          )}
        </div>
        <ErrorMessage
          className={styles.errorMessage}
          name="images"
          component="div"
        />
      </FormWrapper>
      <div className={styles.wrap}>
        <h4>Select and apply the frames.</h4>
        <div className={styles.refe}>
          {allFrames.map((item, index) => (
            <img
              key={index}
              className={styles.pic}
              src={item}
              alt={`Reference frame ${index}`}
              onClick={() => {selectedimageclick(item,`Reference frame ${index}`)}}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default BoothFramesForm;
