import { Booth } from "./types";
import mergeImages from "merge-images";

export const isBoothActive = (booth: Booth) => {
  return booth.isActive && new Date(booth.ends_at) > new Date(booth.starts_at);
};

export const futureDate = (date: Date | string, day: number) => {
  const currentDate = new Date(date);
  const newDate = new Date(currentDate.getTime() + day * 24 * 60 * 60 * 1000);
  return newDate;
};


interface MergeImage {
   src: string;
   x: number;
   y: number;
}

export const getMergedImages = async (images: MergeImage[][]) => {
  const mergedImages = await Promise.all(images.map(image => mergeImages(image)));
  return mergedImages;
};
