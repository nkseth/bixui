/* eslint-disable @next/next/no-img-element */
import { ErrorMessage, FormikContextType, useFormikContext } from "formik";
import React, { useEffect, useRef, useState } from "react";
import swal from "sweetalert2";
import { BoothFormValues } from "../../../../pages/dashboard/booth/new";
import styles from "../../../../styles/dashboard/booth/new/BoothFramesForm.module.scss";
import FileDropArea from "../../../FileDropArea";
import FormWrapper from "../../FormWrapper";
import { APP_URI, IMAGES_URI } from "../../../../constants/variables";
type BoothFramesFormPorps = {};

const BoothFramesForm: React.FC<BoothFramesFormPorps> = ({}) => {
   const MAX_IMAGES = 5;

   const formik: FormikContextType<BoothFormValues> = useFormikContext();
   const [images, setImages] = useState<any>(
      formik.values.images.frames ?? []
   );
   const [selectedImages, setSelectedImages] = useState<string[]>([]);
   const canUploadMore = images.length < MAX_IMAGES;

   const handleFilesList = (files: FileList) => {
      for (let i = 0; i < files.length; i++)
      {
      addImage(files.item(i) as File);
      console.log(files.item(i))
      }
   };

   const addImage = async (file: File) => {
      if (file.type === "image/png") {
         console.log(images)
         setImages((images:any) => [...images, file]);
      }
   };

   const handleImageDelete = (image: File) => {
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
            setImages((i:any) => i.filter((f:any) => f !== image));
         });
   };

   useEffect(() => {
      formik.setFieldValue("images.frames", images);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [images]);


   const allFrames = [
      "/frame1.png",
      "/frame2.png",
      "/frame3.png",
      "/frame4.png",
      "/frame5.png",
    ].map((item) => APP_URI + item);

    const handleSelectedImageDelete = (image: string, index: number) => {
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
          setSelectedImages((prev) =>
            prev.filter((item, key) => key !== index && item !== image)
          );
        });
    };
    
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
         <p style={{ color: 'grey', padding: '5px 0'}}>
            <small>Please use transparent PNG image with Min 1000 x 1000 resolution, refer the frames below for example.</small>
         </p>
         <div className={styles.previewsContainer}>
         {selectedImages.map((image, i) => (
            <div
              key={`${image}-${i}`}
              className={styles.previewContainer}
              onClick={() => handleSelectedImageDelete(image, i)}
            >
              <img alt={image} src={image} />
              <div className={styles.deleteImageHover}>
                <i className="fas fa-trash-alt" />
              </div>
            </div>
          ))}
            {images.map((image:any, i:any) => (
               <div
                  key={image.lastModified + "" + i}
                  className={styles.previewContainer}
                  onClick={() => handleImageDelete(image)}
               >
                  <img alt={image.name} src={URL.createObjectURL(image)} />
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
            name="images.frames"
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
              onClick={() =>selectedimageclick(item,`Reference frame ${index}`)}
            />
          ))}
        </div>
      </div>
      </>
   );
};

export default BoothFramesForm;
