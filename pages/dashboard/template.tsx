import React, { useState, useEffect } from "react";
//import Swal from "sweetalert2";
//import Button from "../../../components/Button";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FormikContextType, useFormikContext } from "formik";
import { BoothFormValues } from "../../pages/dashboard/booth/new";
import DashboardWrapper from "../../components/dashboard/DashboardWrapper";
import FormWrapper from "../../components/dashboard/FormWrapper";
//import api from "../../../constants/api";
//import Spinner from "../../../components/Spinner";
//import { User } from "../../../constants/types";
//import { Frame } from "../../../constants/types";
import { APP_URI, IMAGES_URI } from "../../constants/variables";
import { useStoreState } from "../../hooks/store";
import Image from "next/image";
import styles from "../../styles/dashboard/gallery.module.scss";
import FileDropArea from "../../components/FileDropArea";
import logoFooter from "../../public/logo_footer.png";

type TemplatePorps = {};

const Template: React.FC<TemplatePorps> = ({}) => {
  //const [filterKeyword, setFilterKeyword] = React.useState("");

  //const [isLoading, setIsLoading] = useState(true);

  const user = useStoreState((s) => s.user);

  //React.useEffect(() => {

  //   if (!frames) return;

  //   handleFramesFetch();
  //}, [frames]);

  //const handleFramesFetch = async () => {

  //   try {
  //      const { data } = await api.get("/booths/template");

  //     setFrames(data.data);
  //   } catch (error) {}
  //};

  const allFrames = [
    "/frame1.png",
    "/frame2.png",
    "/frame3.png",
    "/frame4.png",
    "/frame5.png",
    "/frame6.png",
    "/frame7.png",
    "/frame8.png",
    "/frame9.png",
    "/frame10.png",
    "/frame11.png",
    "/frame12.png",
  ].map((item) => APP_URI + item);

  //useEffect(() => {
  //   formik.setFieldValue("images.frames", images);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  //}, [images]);

  // const handleClick = () => {
  //   let frame = window.document.querySelector("#pic")!;
  //   frame.classList.add("grey");
  //   if (frame === null) {
  //     alert(null);
  //   }
  // };

  return (
    <>
      {
        /*isLoading ? (
        <div
           style={{ margin: "45vh auto", width: "fit-content" }}
        >
            <Spinner/>
        </div>
   ) : (*/

        <div>
          <DashboardWrapper
            headerProps={{
              location: [{ title: "Dashboard" }, { title: "Template" }],
            }}
          >
            <FormWrapper
              title={
                <>
                  <h2>Frames</h2>
                  <small style={{ color: "grey" }}>Select any 5 frames.</small>
                  <input
                    type="text"
                    placeholder="Search Template..."
                    style={{ maxWidth: 265 }}
                    //onChange={(e) => setFilterKeyword(e.target.value)}
                    //value={filterKeyword}
                  />
                </>
              }
            >
              {
                /*filteredResult.map((u, index) => (*/
                <>
                  {/* {user?.isOwner ? (
                    <FileDropArea
                      onUpload={""}
                      style={{ width: "auto", height: 100 }}
                      allowed={["image/png"]}
                      multiple
                    />
                  ) : null} */}
                  <div className={styles.pics_wrap}>
                    {allFrames.map((item, index) => (
                      <>
                        <div className={styles.pics_container}>
                          <LazyLoadImage
                            key={index}
                            className={styles.pics}
                            src={item}
                            alt={`Reference frame ${index}`}
                          />
                          <a
                            href={item}
                            className={styles.link}
                            download
                            title="Download"
                          >
                            <i className="fas fa-download"></i>
                          </a>
                        </div>
                      </>
                    ))}
                  </div>
                </>
                /*))*/
              }
            </FormWrapper>
          </DashboardWrapper>

          <div className={styles.footer}>
            <div className={styles.logo_footer}>
              <Image src={logoFooter} alt="Powered by BizConnect" />
            </div>
          </div>
        </div>

        /*)*/
      }
    </>
  );
};

export default Template;
