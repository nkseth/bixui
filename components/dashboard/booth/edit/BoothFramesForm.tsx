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

type BoothFramesFormPorps = {};

const BoothFramesForm: React.FC<BoothFramesFormPorps> = ({}) => {
  const MAX_IMAGES = 5;

  const formik: FormikContextType<BoothFormValues> = useFormikContext();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [images, setImages] = useState<any[]>(formik.values.images.frames);

  const canUploadMore = images.length < MAX_IMAGES;

  const handleFilesList = (files: FileList) => {
    for (let i = 0; i < files.length; i++) addImage(files.item(i) as File);
  };

  const addImage = async (file: File) => {
    if (file.type === "image/png") {
      setImages((images) => [...images, file]);
    }
  };

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
        setImages((i) => i.filter((f) => f !== image));
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
          {images.map((image, i) => (
            <div
              key={
                (image?.filename ? image.filename : image.lastModified) + "" + i
              }
              className={styles.previewContainer}
              onClick={() => handleImageDelete(image)}
            >
              <img
                alt={image.filename ? image.filename : image.name}
                src={
                  image.filename
                    ? IMAGES_URI + image.filename
                    : URL.createObjectURL(image)
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
              onClick={() => setSelectedImages((prev) => [...prev, item])}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default BoothFramesForm;
