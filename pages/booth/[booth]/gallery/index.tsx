import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import React from "react";
import Gallery from "react-photo-gallery";
import BoothWrapper from "../../../../components/booth/BoothWrapper";
import api from "../../../../constants/api";
import { isBoothActive } from "../../../../constants/helpers";
import { Booth, CapturedImage } from "../../../../constants/types";
import { IMAGES_URI } from "../../../../constants/variables";

const Index = (
   props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
   const { images } = props;
   const router = useRouter();

   return (
      <BoothWrapper booth={props.booth}>
         <h2 className="title">Gallery</h2>
         <Gallery
            photos={images.map((image) => ({
               src: IMAGES_URI + image.filename,
               height: 1,
               width: parseFloat(image.aspectRatio),
            }))}
            margin={4}
            onClick={(e, { index }) =>
               router.push(
                  "/booth/" +
                     props.booth.slug +
                     "/gallery/" +
                     images[index].filename
               )
            }
         />
      </BoothWrapper>
   );
};

export default Index;

export const getServerSideProps: GetServerSideProps<{
   booth: Booth;
   images: CapturedImage[];
}> = async (context) => {
   const { booth: slug } = context.params as { booth: string };

   try {
      const { data: booth } = await api.get(`/booth/${slug}`);
      
      const { data } = await api.get(`/booth/${slug}/gallery`);
      const { data: images } = data;

      if (!isBoothActive(booth as Booth)) throw Error("Booth inactive");

      return {
         props: { booth, images },
      };
   } catch (err) {
      return {
         notFound: true,
      };
   }
};
