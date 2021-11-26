import React, { useState } from "react";
import * as Yup from "yup";
import ProgressBar from "@ramonak/react-progress-bar";
import Image from 'next/image';
import api from "../../../../constants/api";
import logoFooter from '../../../../public/logo_footer.png';
import DashboardWrapper from "../../../../components/dashboard/DashboardWrapper";
import BoothInfoForm from "../../../../components/dashboard/booth/edit/BoothInfoForm";
import BoothFramesForm from "../../../../components/dashboard/booth/edit/BoothFramesForm";
import FormikStepper, {
   FormikStep,
} from "../../../../components/FormikStepper";
import BoothStylesForm from "../../../../components/dashboard/booth/edit/BoothStylesForm";
import BoothSettingsForm from "../../../../components/dashboard/booth/edit/BoothSettingsForm";
import { FormikHelpers, FormikValues } from "formik";
import FormWrapper from "../../../../components/dashboard/FormWrapper";
import { useRouter } from "next/router";
import BoothPhrasesForm from "../../../../components/dashboard/booth/edit/BoothPhrasesForm";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Booth, Frame } from "../../../../constants/types";
import styles from "../../../../styles/dashboard/booth/all/page.module.scss";
import { APP_URI, IMAGES_URI } from "../../../../constants/variables";
type NewBoothPorps = {};

export type BoothFormValues = {
   event: {
      title: string;
      slug: string;
      startDate: Date;
      endDate: Date;
      url: string;
   };
   images: {
      logo: File | string | null;
      background: File | string | null;
      frames: (File | Frame)[];
   };
   colors: { text: string; background: string };
   cameras: { still: boolean; burst: boolean; gif: boolean };
   sharing: {
      facebook: boolean;
      twitter: boolean;
      pinterest: boolean;
      linkedin: boolean;
      email: boolean;
      download: boolean;
   };
   phrases: [[string, string], [string, string], [string, string]];
};

const EditBooth = (
   booth: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
   const [isSubmitting, setIsSubmitting] = useState(false);

   const [uploadProgress, setUploadProgress] = useState(0);

   const router = useRouter();

   const initialValues: BoothFormValues = {
      event: {
         title: booth.config.title,
         slug: booth.slug,
         startDate: new Date(booth.starts_at),
         endDate: new Date(booth.ends_at),
         url: booth.config.event ?? "",
      },
      colors: {
         background: booth.config.colors.background,
         text: booth.config.colors.text,
      },
      sharing: {
         facebook: booth.config.sharing.facebook,
         twitter: booth.config.sharing.twitter,
         pinterest: booth.config.sharing.pinterest,
         linkedin: booth.config.sharing.linkedin,
         email: booth.config.sharing.email,
         download: booth.config.sharing.download,
      },
      cameras: booth.config.cameras,
      images: booth.config.images,
      phrases: booth.config.phrases,
   };

   const infoFormValidationSchema = Yup.object().shape({
      event: Yup.object().shape({
         title: Yup.string()
            .required("Title is Required")
            .max(
               40,
               ({ max }) => `Title should be less than ${max} characters`
            ),
         slug: Yup.string().oneOf([booth.slug], "Slug can't be changed"),
         startDate: Yup.date().required("Start date is required"),
         endDate: Yup.date()
            .required("End date is required")
            .when("startDate", (startDate, schema) => {
               return schema.min(
                  startDate,
                  "End date should be after the start date"
               );
            }),
      }),
   });

   const framesFormValidationSchema = Yup.object().shape({
      images: Yup.object().shape({
         frames: Yup.array()
            .min(1, "At least one frame is required")
            .max(5, "Max 5 frames"),
      }),
   });

   const stylesFormValidationSchema = Yup.object().shape({
      colors: Yup.object().shape({
         text: Yup.string().required("Text color is required"),
         background: Yup.string().required("Background color is required"),
      }),
      images: Yup.object().shape({
         logo: Yup.mixed()
            .nullable()
            .test(
               "fileFormat",
               "Only png images are allowed",
               (value: File | null) => {
                  if (value === null)
                     return true;
                  return value && (typeof value === 'string' || value.type === "image/png");
               }
            ),
         background: Yup.mixed().nullable(),
      }),
   });

   const settingsFormValidationSchema = Yup.object().shape({
      social: Yup.object({
         facebook: Yup.boolean(),
         twitter: Yup.boolean(),
         pinterest: Yup.boolean(),
         linkedin: Yup.boolean(),
         email: Yup.boolean(),
         download: Yup.boolean(),
         sms: Yup.boolean(),
         wechat: Yup.boolean(),
         weibo: Yup.boolean(),
         snapchat: Yup.boolean(),
         whatsapp: Yup.boolean(),
      }),
      cameras: Yup.object({
         still: Yup.boolean(),
         burst: Yup.boolean(),
         gif: Yup.boolean(),
      }),
   });

   const phrasesFormValidationSchema = Yup.object().shape({
      phrases: Yup.array()
         .required()
         .min(3)
         .max(3)
         .of(
            Yup.array()
               .required()
               .min(2)
               .max(2)
               .of(Yup.string().required("Title is required").min(5).max(60))
         ),
      event: Yup.object().shape({
         url: Yup.string()
            .url("Please provide a valid URL, including http or https")
            .nullable(),
      }),
   });

   const handleSubmit = (
      values: FormikValues,
      formikHelpers: FormikHelpers<FormikValues>
   ) => {
      values.event.startDate = values.event.startDate.valueOf();
      values.event.endDate = values.event.endDate.valueOf();
      const gggi=()=>{
         const form = new FormData();
     
         Object.keys(values).forEach((top) => {
            Object.keys(values[top]).forEach((mid) => {
               const val = values[top][mid];
               if (Array.isArray(val)) {
                  val.forEach((_, i) => {
                     form.append(
                        top + "[" + mid + "][]",
                        val[i].filename ? JSON.stringify(val[i]) : val[i]
                     );
                  });
               } else {
                  form.append(top + "[" + mid + "]", val);
               }
            });
               
         });
         setIsSubmitting(true);
         console.log(form)
         api.post(`/booth/${booth.slug}/edit`, form, {
            onUploadProgress: (e) => setUploadProgress(e.loaded / e.total),
         })
            .then(() => {
               router.push("/dashboard/booth/all");
            })
            .catch(alert)
            .finally(() => {
               setIsSubmitting(false);
            });
   
       }

      const imageconvertor=async(url:any,name:any)=>{
 
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
     
     return dataURLtoFile(data,name)
     
       }

         let finalarr:any=[]
          let img:any=[]
           console.log(values)
 
       Promise.all(values.images.frames?.map(async (item:any)=>{
            if(item instanceof File) img.push(item)
           else{
            const imageobb=  await imageconvertor(`${IMAGES_URI+item.filename}`,item.filename)
   
           img.push(imageobb)
           }
        return img
        
       })).then((result)=>{
        finalarr=result[0]
         console.log("this is result",result)
       
      values.images.frames=finalarr
    
      console.log(values)

      const hello=values.images.logo
    
      if(hello){
  
         const mypromise=async()=>{
            const value=values.images.logo
         if(value instanceof File) return value
        else return await imageconvertor(`${IMAGES_URI+value}`,value)
      }
      mypromise().then((result2)=>{
    
       console.log(result2)
         values.images.logo=result2

    const hello2=values.images.background
if(hello2){
         
            const mypromise2=async()=>{
               if(hello2 instanceof File) return hello2
           return await imageconvertor(`${IMAGES_URI+hello2}`,hello2)
         }
mypromise2().then((result3)=>{
         
          console.log(result3)
            values.images.background=result3
            gggi()
      
         })
     
      }
      else gggi()
 })
  
   }
   else{
      const hello4=values.images.background

      if(hello4){
        
         const mypromise4=async()=>{
            if(hello4 instanceof File) return hello4   
       else return await imageconvertor(`${IMAGES_URI+hello4}`,hello4)
      }
      mypromise4().then((result4)=>{
       
       console.log(result4)
         values.images.background=result4
         gggi()
   
      })
  
   }
   else gggi()
   }


   })   

}


   return (
   <>   
      <DashboardWrapper
         headerProps={{
            location: [
               { title: "Dashboard" },
               { title: "Booth" },
               { title: "Edit" },
            ],
         }}
      >
         {isSubmitting && (
            <FormWrapper title="Uploading">
               <div style={{ margin: "0 auto", maxWidth: 480, marginTop: 32 }}>
                  <ProgressBar completed={uploadProgress} />
               </div>
            </FormWrapper>
         )}

         <div style={{ display: isSubmitting ? "none" : "block" }}>
            <FormikStepper
               initialValues={initialValues}
               onSubmit={handleSubmit}
               isInitialValid
            >
               <FormikStep validationSchema={infoFormValidationSchema}>
                  <BoothInfoForm />
               </FormikStep>
               <FormikStep validationSchema={framesFormValidationSchema}>
                  <BoothFramesForm />
               </FormikStep>
               <FormikStep validationSchema={settingsFormValidationSchema}>
                  <BoothSettingsForm />
               </FormikStep>
               <FormikStep validationSchema={stylesFormValidationSchema}>
                  <BoothStylesForm />
               </FormikStep>
               <FormikStep validationSchema={phrasesFormValidationSchema}>
                  <BoothPhrasesForm />
               </FormikStep>
            </FormikStepper>
         </div>
      </DashboardWrapper>
      <div className={styles.footer}><div className={styles.logo_footer}><Image src={logoFooter} alt="Powered by BizConnect"/></div></div>
   </>
   );
};

export default EditBooth;

export const getServerSideProps: GetServerSideProps<Booth> = async (
   context
) => {
   const { booth } = context.params as { booth: string };

   try {
      const { data } = await api.get(`/booth/${booth}`);
      
      return {
         props: data,
      };
   } catch (err) {
      return {
         notFound: true,
      };
   }
};
