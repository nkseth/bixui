import Swal from "sweetalert2";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useRouter } from "next/router";
import api from "../../constants/api";
import React from "react";
import { CapturedImage } from "../../constants/types";
import { IMAGES_URI } from "../../constants/variables";
import styles from "../../styles/dashboard/gallery.module.scss";

interface GalleryImg {
  image: CapturedImage;
  selectedImages: CapturedImage[];
  handleSelectedImages: (image: CapturedImage) => void;
}

const GalleryImage = ({
  image,
  image: { filename, expired_at },
  selectedImages,
  handleSelectedImages,
}: GalleryImg) => {
  const router = useRouter();
  const isExpired = expired_at ? new Date() > new Date(expired_at) : false;

  const handleDelete = async () => {
    const { isConfirmed } = await Swal.fire({
      title: "Delete Image ?",
      icon: "warning",
      confirmButtonText: "Delete",
      denyButtonText: "Cancel",
      showConfirmButton: true,
      showDenyButton: true,
    });
    if (!isConfirmed) return;
    api.post("/images/delete", { filename }).catch((error) => {
      console.log("error" || error.response.data);
    });
  };
  const handleBlock = async () => {
    const { isConfirmed } = await Swal.fire({
      title: "Block Image From Photobooth Gallery?",
      icon: "warning",
      confirmButtonText: "Block",
      denyButtonText: "Cancel",
      showConfirmButton: true,
      showDenyButton: true,
    });
    if (!isConfirmed) return;
    api.get(`/images/${filename}/0/public`).catch((error) => {
      console.log("error" || error.response.data);
    });
  };

  const handleDownload = async () => {
    const { isConfirmed } = await Swal.fire({
      title: "Download Images ?",
      icon: "warning",
      confirmButtonText: "Download",
      denyButtonText: "Cancel",
      showConfirmButton: true,
      showDenyButton: true,
    });
    if (!isConfirmed) return;
    let link = document.createElement("a");
    link.href = `${IMAGES_URI}${filename}/download`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const isChecked = selectedImages?.some((item) => item?.filename === filename);

  return !isExpired ? (
    <>
      <div className={styles.galleryImage}>
        <LazyLoadImage
          className={styles.image}
          src={IMAGES_URI + filename}
          alt="photobooth pics"
          effect="opacity"
        />

        <div className={styles.imageControls}>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => handleSelectedImages(image)}
            title="Select"
            className={styles.input}
          />
          <button
            className={styles.imageDelete}
            onClick={() => handleBlock()}
            title="Disable from photobooth"
          >
            <i className="fas fa-ban"></i>
          </button>
          <button
            className={styles.imageDelete}
            title="Download"
            onClick={() => handleDownload()}
          >
            <i className="fas fa-download"></i>
          </button>
          <button
            className={styles.imageDelete}
            onClick={() => handleDelete()}
            title="Delete"
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
      <div className={styles.line}></div>
    </>
  ) : null;
};
export default GalleryImage;