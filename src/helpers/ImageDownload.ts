import React, { useCallback, useEffect, useState, useContext } from "react";
import { toPng } from "html-to-image";
import { KTON_CONTEXT } from "../context/KTONContext";

export interface ImageDownloadProps {
  refrence: React.RefObject<HTMLDivElement>;
  title: string;
  imageWidth: number;
}

const ImageDownload = ({ refrence, title, imageWidth }: ImageDownloadProps) => {
  const { userinfo } = useContext(KTON_CONTEXT);
  const userSubscribed = userinfo && userinfo.subscription_end < new Date();

  //Image download function
  const handleImageDownload = useCallback(async () => {
    if (refrence.current === null || !userinfo) {
      return;
    }

    const watermarkText = "KTON.XYZ"; // Set your watermark text here

    //Styles to make watermark annoying
    const watermarkStyles = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%) rotate(-45deg)", // Rotate the element by -45 degrees
      color: "black", // Adjust the color and opacity as needed
      fontSize: `${imageWidth * 0.25}px`,
      opacity: 0.1,
    };

    //Adding watermark to the image div
    const watermarkElement = document.createElement("h1");
    watermarkElement.textContent = watermarkText;

    if (!userSubscribed) {
      Object.assign(watermarkElement.style, watermarkStyles);
      // Append the watermark h2 element to the div
      refrence.current.appendChild(watermarkElement);
    }

    try {
      const dataUrl = await toPng(refrence.current, { cacheBust: false });

      const link = document.createElement("a");
      link.download = title;
      link.href = dataUrl;
      link.click();
      if (refrence.current) refrence.current.removeChild(watermarkElement);
    } catch (err) {
      throw new Error("Failed to download image");
    }

    // Remove the watermark element from the div
  }, [refrence]);

  return {
    handleImageDownload,
  };
};

export default ImageDownload;
