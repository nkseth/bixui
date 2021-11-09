/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import BoothWrapper from "../../../../components/booth/BoothWrapper";
import Button from "../../../../components/Button";
import api from "../../../../constants/api";
import { isBoothActive } from "../../../../constants/helpers";
import { Booth } from "../../../../constants/types";
import { IMAGES_URI } from "../../../../constants/variables";

const Image = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const router = useRouter();
  const { image } = router.query as { image: string };
  const { config } = props;
  const URL =
    "https://bizconnectevents/booth/" +
    props.slug +
    "/gallery/" +
    image;

  return (
    <>
      <Head>
        <meta property="og:image" content={IMAGES_URI + image} />
        <meta name="twitter:image" content={IMAGES_URI + image} />
        <meta property="og:title" content={config.title} />
        <meta name="twitter:title" content={config.title} />
        <meta name="twitter:card" content="summary" />
      </Head>
      <BoothWrapper booth={props}>
        <div className="galleryPreviewContainer">
          <div className="buttonsContainer">
            {config.sharing.download && (
              <ShareButton
                icon="fas fa-download"
                download={`[${config.title}] Image.gif`}
                url={IMAGES_URI + image}
              />
            )}
            {config.sharing.facebook && (
              <ShareButton
                icon="fab fa-facebook-f"
                url={"https://www.facebook.com/sharer/sharer.php?u=" + URL}
              />
            )}
            {config.sharing.twitter && (
              <ShareButton
                icon="fab fa-twitter"
                url={"https://twitter.com/intent/tweet?url=" + URL}
              />
            )}
            {config.sharing.pinterest && (
              <ShareButton
                icon="fab fa-pinterest"
                url={"http://pinterest.com/pin/create/button/?url=" + URL}
              />
            )}
            {config.sharing.linkedin && (
              <ShareButton
                icon="fab fa-linkedin"
                url={
                  "https://www.linkedin.com/sharing/share-offsite/?url=" + URL
                }
              />
            )}
            {config.sharing.email && (
              <ShareButton
                icon="fas fa-envelope"
                url={"mailto:?subject=Photobooth selfie&body=" + URL}
              />
            )}
          </div>
          <img src={IMAGES_URI + image} alt={image} className="previewImage" />
        </div>
        <div className="buttonsContainer">
          <Button
            title="Back to booth"
            icon="fas fa-chevron-left"
            onClick={() => router.push("/booth/" + props.slug)}
          />
          <Button
            title="Gallery"
            icon="fas fa-images"
            isIconRight
            onClick={() => router.push("/booth/" + props.slug + "/gallery")}
          />
        </div>
      </BoothWrapper>
    </>
  );
};

const ShareButton: React.FC<
  React.ComponentProps<typeof Button> & { url?: string }
> = ({ url, onClick, download, ...props }) => {
  return url ? (
    <a href={url} target="_blank" rel="noreferrer" {...{ download }}>
      <Button isRounded size={50} iconSize={16} {...props} />
    </a>
  ) : (
    <Button isRounded size={50} iconSize={16} {...props} />
  );
};

export default Image;

export const getServerSideProps: GetServerSideProps<Booth> = async (
  context
) => {
  const { booth, image } = context.params as { booth: string; image: string };

  try {
    const { data } = await api.get(`/booth/${booth}`);
    await api.get(`/images/${image}`);

    if (!isBoothActive(data as Booth)) throw Error("Booth inactive");

    return {
      props: data,
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
