/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, useFormikContext } from "formik";
import styles from "../../../../styles/dashboard/booth/new/BoothStylesForm.module.scss";
import swal from "sweetalert2";
import FormWrapper from "../../FormWrapper";
import SectionDropdown from "../../SectionDropdown";
import FileDropArea from "../../../FileDropArea";
import { BoothFormValues } from "../../../../pages/dashboard/booth/[booth]/edit";
import { IMAGES_URI } from "../../../../constants/variables";

type BoothStylesFormPorps = {};

const BoothStylesForm: React.FC<BoothStylesFormPorps> = ({}) => {
   const formik = useFormikContext<BoothFormValues>();
   const [backgroundImage, setBackgroundImage] = useState<File |string| null>(formik.values.images.background);
   let [logoImage, setLogoImage] = useState<File |string| null>(formik.values.images.logo);
      
   useEffect(() => {
      formik.setFieldValue("images.logo", logoImage);
      formik.validateField("images.logo");
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [logoImage]);

   useEffect(() => {
      formik.setFieldValue("images.background", backgroundImage);
      formik.validateField("images.background");
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [backgroundImage]);


   return (
      <FormWrapper title="Styling" divider>
         <ErrorMessage
            component="div"
            className={styles.errorMessage}
            name="images.logo"
         />
         <ErrorMessage
            component="div"
            className={styles.errorMessage}
            name="colors.background"
         />
         <ErrorMessage
            component="div"
            className={styles.errorMessage}
            name="colors.text"
         />
         <SectionDropdown title="logo" initIsOpen>
            <h4 className={styles.title} style={{ marginTop: 0, color: '#0f5ad9' }}>
               Logo
            </h4>
            <p style={{ color: 'grey', padding: '5px 0'}}>
               <small>Please use transparent PNG image, max resolution is 200 x 400.</small>
            </p>
            {logoImage && (
      
               <img
               src={typeof logoImage === "string"
               ? IMAGES_URI + logoImage
               : URL.createObjectURL(logoImage)}
                  alt={
                     typeof logoImage === "string" ? logoImage : logoImage.name
                  }
                  className={styles.imgPreview}
               />
            )}
            <FileDropArea
               allowed={["image/png"]}
               onUpload={(files) => setLogoImage(files.item(0))}
            />
         </SectionDropdown>
         {/* <SectionDropdown title="Buttons & borders" /> */}
         <SectionDropdown title="Background" initIsOpen>
            <h4 className={styles.title} style={{ marginTop: 0, color: '#0f5ad9'  }}>
               Background Image
            </h4>
            <p style={{ color: 'grey', padding: '5px 0'}}>
               <small>Please use PNG/JPG/SVG/WEBP image without text or logo for better visual, max resolution is 1920 x 1080.</small>
            </p>
            {backgroundImage && (
               
               <img
                  src={typeof backgroundImage === "string"
                  ? IMAGES_URI + backgroundImage
                  : URL.createObjectURL(backgroundImage)}
                  alt={
                     typeof backgroundImage === "string"
                        ? backgroundImage
                        : backgroundImage.name
                  }
                  className={styles.imgPreview}
               />
         
            )}
            <FileDropArea
               allowed={["image/PNG", "image/SVG", "image/jpeg", "image/WEBP"]}
               onUpload={(files) => setBackgroundImage(files.item(0))}
            />
            <h4 className={styles.title} style={{color: '#0f5ad9'}}>Background Color</h4>
            <div className={styles.colorInputContainer}>
               <Field type="color" name="colors.background" id="cwckviwevwe" />
               <label htmlFor="cwckviwevwe">Background</label>
            </div>
            <h4 className={styles.title} style={{color: '#0f5ad9'}}>Text Color</h4>
            <div className={styles.colorInputContainer}>
               <Field type="color" name="colors.text" id="cececece" />
               <label htmlFor="cececece">Text</label>
            </div>
         </SectionDropdown>
      </FormWrapper>
   );
};

export default BoothStylesForm;
