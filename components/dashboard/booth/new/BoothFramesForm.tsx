/* eslint-disable @next/next/no-img-element */
import { ErrorMessage, FormikContextType, useFormikContext } from "formik";
import React, { useEffect, useRef, useState } from "react";
import swal from "sweetalert2";
import { BoothFormValues } from "../../../../pages/dashboard/booth/new";
import styles from "../../../../styles/dashboard/booth/new/BoothFramesForm.module.scss";
import FileDropArea from "../../../FileDropArea";
import FormWrapper from "../../FormWrapper";

type BoothFramesFormPorps = {};

const BoothFramesForm: React.FC<BoothFramesFormPorps> = ({}) => {
   const MAX_IMAGES = 5;

   const formik: FormikContextType<BoothFormValues> = useFormikContext();
   const [images, setImages] = useState<File[]>(
      formik.values.images.frames ?? []
   );

   const canUploadMore = images.length < MAX_IMAGES;

   const handleFilesList = (files: FileList) => {
      for (let i = 0; i < files.length; i++) addImage(files.item(i) as File);
   };

   const addImage = async (file: File) => {
      if (file.type === "image/png") {
         setImages((images) => [...images, file]);
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
            setImages((i) => i.filter((f) => f !== image));
         });
   };

   useEffect(() => {
      formik.setFieldValue("images.frames", images);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [images]);

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
            {images.map((image, i) => (
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
               <img className={styles.pic} src="/frame1.png" alt="Reference frame 1"/>
               <img className={styles.pic} src="/frame3.png" alt="Reference frame 2"/>    
               <img className={styles.pic} src="/frame2.png" alt="Reference frame 3"/>
               <img className={styles.pic} src="/frame4.png" alt="Reference frame 4"/>
               <img className={styles.pic} src="/frame5.png" alt="Reference frame 5"/>
         </div>
      </div>   
      </>
   );
};

export default BoothFramesForm;
