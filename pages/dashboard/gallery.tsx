import React, { useState, useEffect } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import styles from "../../styles/dashboard/gallery.module.scss";
import api from "../../constants/api";
import DashboardWrapper from "../../components/dashboard/DashboardWrapper";
import FormWrapper from "../../components/dashboard/FormWrapper";
import { useStoreState } from "../../hooks/store";
import Spinner from "../../components/Spinner";
import { Booth, CapturedImage } from "../../constants/types";
import logoFooter from "../../public/logo_footer.png";
import { IMAGES_URI } from "../../constants/variables";
import GalleryImage from "../../components/dashboard/GalleryImage";
import { futureDate } from "../../constants/helpers";

type GalleryPorps = {};

const Gallery: React.FC<GalleryPorps> = ({}) => {
  const [booths, setBooths] = useState<Booth[]>([]);
  const user = useStoreState((s) => s.user);

  const [isLoading, setIsLoading] = useState(true);

  const [images, setImages] = useState<CapturedImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<CapturedImage[]>([]);

  const handleSelectedImages = (image: CapturedImage) => {
    setSelectedImages((prev) =>
      prev.find((item) => item.filename === image.filename)
        ? prev.filter((item) => item.filename !== image.filename)
        : [...prev, image]
    );
  };

  useEffect(() => {
    if (!user) return;

    api
      .get("/me/booths")
      .then((res) => {
        const data = res.data.data;
        //console.log(data)
        setBooths(data);
        handleImages(data);
      })
      .finally(() => setIsLoading(false));
  }, [user]);

  const handleImages = (data: Booth[]) => {
    const images =
      data
        .map((item) =>
          (item.images || []).map((image) => ({
            ...image,
            slug: item.slug,
            expired_at: futureDate(item.ends_at, 30),
          }))
        )
        .flat() || [];
    setImages(images);
  };

  // @todo - download All images
  const handleDownloadAll = () => {
    
    images.forEach((image) => {
    let link = document.createElement("a");
    link.href = `${IMAGES_URI}${image.filename}/download`;  //the api for download All '/images/downloadAll/1' 
    link.download = image.filename;                        //but currently trying the single download api, pls refer GalleryImage.tsx
    document.body.appendChild(link);
    link.click();
    link.remove();
    });
    // const { isConfirmed } = await Swal.fire({
    //   title: "Download All Images ?",
    //   icon: "warning",
    //   confirmButtonText: "Download",
    //   denyButtonText: "Cancel",
    //   showConfirmButton: true,
    //   showDenyButton: true,
    // });
    // if (!isConfirmed) return;
    // api
    //   .get("/images/downloadAll/1")
    //   .then(() => alert(JSON.stringify("downloading...")))
    //   .catch((error) => {
    //     console.log("error" || error.response.data);
    //   });
  };
  // @todo - download Selected images
  const handleDownloadSelected = async () => {
    const { isConfirmed } = await Swal.fire({   //@todo Swal pop up changing the gallery container size, style bug
      title: "Download Selected Images ?",
      icon: "warning",
      confirmButtonText: "Download",
      denyButtonText: "Cancel",
      showConfirmButton: true,
      showDenyButton: true,
    });
    if (!isConfirmed) return;
    selectedImages.forEach((image) => {
      let link = document.createElement("a");
      link.href = `${IMAGES_URI}${image.filename}/download`;
      link.download = image.filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  };

  return (
    <>
      {isLoading ? (
        <div style={{ margin: "45vh auto", width: "fit-content" }}>
          <Spinner />
        </div>
      ) : (
        <div>
          <DashboardWrapper
            headerProps={{
              location: [{ title: "Dashboard" }, { title: "Gallery" }],
            }}
          >
            <FormWrapper title="Photos">
              <>
                <button
                  onClick={() => handleDownloadAll()}
                  className={styles.imageDownload}
                >
                  Download All
                </button>
                <button
                  onClick={() => handleDownloadSelected()}
                  className={styles.imageDownload}
                  disabled={selectedImages?.length === 0}
                >
                  Download Selected
                </button>
                <div className={styles.galleryImages}>
                  {console.log(images)}
                  {images.map((image, key) => (
                    <GalleryImage
                      key={key}
                      image={image}
                      selectedImages={selectedImages}
                      handleSelectedImages={handleSelectedImages}
                    />
                  ))}
                </div>
              </>
            </FormWrapper>
          </DashboardWrapper>

          <div className={styles.footer}>
            <div className={styles.logo_footer}>
              <Image src={logoFooter} alt="Powered by BizConnect" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
