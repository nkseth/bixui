import React, { useState } from "react";
import * as Yup from "yup";
import ProgressBar from "@ramonak/react-progress-bar";
import Image from "next/image";
import api from "../../../constants/api";
import styles from "../../../styles/dashboard/booth/all/page.module.scss";
import DashboardWrapper from "../../../components/dashboard/DashboardWrapper";
import BoothInfoForm from "../../../components/dashboard/booth/new/BoothInfoForm";
import BoothFramesForm from "../../../components/dashboard/booth/new/BoothFramesForm";
import FormikStepper, { FormikStep } from "../../../components/FormikStepper";
import BoothStylesForm from "../../../components/dashboard/booth/new/BoothStylesForm";
import BoothSettingsForm from "../../../components/dashboard/booth/new/BoothSettingsForm";
import { FormikHelpers, FormikValues } from "formik";
import FormWrapper from "../../../components/dashboard/FormWrapper";
import { useRouter } from "next/router";
import BoothPhrasesForm from "../../../components/dashboard/booth/new/BoothPhrasesForm";
import logoFooter from "../../../public/logo_footer.png";
import { futureDate } from "../../../constants/helpers";

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
    logo: File | null;
    background: File | null;
    frames: File[];
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
    // sms: boolean;
    // wechat: boolean;
    // weibo: boolean;
    // snapchat: boolean;
    // whatsapp: boolean;
  };
  phrases: [[string, string], [string, string], [string, string]];
};

export const slugValidator = Yup.string()
  .required("Slug is required")
  .matches(
    /^[a-zA-Z0-9_-]*$/,
    "Slug should only contain numbers, letters, _ and -"
  )
  .min(6, ({ min }) => `Slug should be at least ${min} characters`)
  .max(20, ({ max }) => `Slug should be less than ${max} characters`)
  .test("isAvailable", "Slug is already used", async (slug) => {
    try {
      const { data } = await api.get("/slug/" + slug);
      return data.isAvailable;
    } catch (err) {
      return false;
    }
  });

const NewBooth: React.FC<NewBoothPorps> = ({}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);

  const router = useRouter();
  const endDateCond = new Date();

  const initialValues: BoothFormValues = {
    event: {
      title: "",
      slug: "",
      startDate: new Date(),
      endDate: futureDate(new Date(), 7),
      url: "",
    },
    colors: {
      background: "#000000",
      text: "#ffffff",
    },
    sharing: {
      facebook: true,
      twitter: true,
      pinterest: true,
      linkedin: true,
      email: true,
      download: true,
      // sms: false,
      // wechat: false,
      // weibo: false,
      // snapchat: false,
      // whatsapp: false,
    },
    cameras: {
      still: true,
      burst: false,
      gif: false,
    },
    images: { frames: [], background: null, logo: null },
    phrases: [
      ["Select Your Experience", "Choose below!"],
      ["Select your template!", "Select the one you like most"],
      ["Strike a pose!", "Get in position and press start!"],
    ],
  };

  const infoFormValidationSchema = Yup.object().shape({
    event: Yup.object().shape({
      title: Yup.string()
        .required("Title is Required")
        .max(40, ({ max }) => `Title should be less than ${max} characters`),
      slug: slugValidator,
      startDate: Yup.date().required("Start date is required"),
      endDate: Yup.date()
        .required("End date is required")
        .when("startDate", (startDate, schema) =>
          schema.test(
            "date",
            "invalid end date",
            (value: any) =>
              Number(value) - Number(startDate) > 1 * 24 * 60 * 60 * 1000
          )
        ),
    }),
  });

  const framesFormValidationSchema = Yup.object().shape({
    images: Yup.object().shape({
      frames: Yup.array()
        .ensure()
        .compact()
        .of(
          Yup.mixed().test(
            "fileFormat",
            "Only png images are allowed",
            (value: File) => {
              return value && value.type === "image/png";
            }
          )
        )
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
      logo: Yup.mixed().nullable(),
      // .test(
      //    "fileFormat",
      //    "Only png images are allowed",
      //    (value: File | null) => {
      //       if (value === null) return true;

      //       return value && value.type === "image/png";
      //    }
      // ),
      background: Yup.mixed().nullable(),
    }),
  });

  const settingsFormValidationSchema = Yup.object().shape({
    social: Yup.object({
      facebook: Yup.boolean(),
      twitter: Yup.boolean(),
      pinterest: Yup.boolean(),
      email: Yup.boolean(),
      linkedin: Yup.boolean(),
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
        .url("Please provide a valid URL, with https")
        .nullable(),
    }),
  });

  const handleSubmit = (
    values: FormikValues,
    formikHelpers: FormikHelpers<FormikValues>
  ) => {
    values.event.startDate = values.event.startDate.valueOf();
    values.event.endDate = values.event.endDate.valueOf();

    const form = new FormData();

    Object.keys(values).forEach((top) => {
      Object.keys(values[top]).forEach((mid) => {
        const val = values[top][mid];
        if (Array.isArray(val)) {
          val.forEach((_, i) => {
            form.append(top + "[" + mid + "][]", val[i]);
          });
        } else {
          form.append(top + "[" + mid + "]", val);
        }
      });
    });

    setIsSubmitting(true);

    api
      .post("/booth/create", form, {
        onUploadProgress: (e) => setUploadProgress(e.loaded / e.total),
      })
      .then(() => {
        router.push("/dashboard/booth/all");
      })
      .catch(alert)
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <DashboardWrapper
        headerProps={{
          location: [
            { title: "Dashboard" },
            { title: "Booth" },
            { title: "New" },
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
          <FormikStepper initialValues={initialValues} onSubmit={handleSubmit}>
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
      <div className={styles.footer}>
        <div className={styles.logo_footer}>
          <Image src={logoFooter} alt="Powered by BizConnect" />
        </div>
      </div>
    </>
  );
};

export default NewBooth;
