import FormatAlignLeftOutlinedIcon from "@mui/icons-material/FormatAlignLeftOutlined";
import FormatAlignRightOutlinedIcon from "@mui/icons-material/FormatAlignRightOutlined";
import FormatAlignCenterOutlinedIcon from "@mui/icons-material/FormatAlignCenterOutlined";
import FormatAlignJustifyOutlinedIcon from "@mui/icons-material/FormatAlignJustifyOutlined";
import VerticalAlignCenterOutlinedIcon from "@mui/icons-material/VerticalAlignCenterOutlined";
import VerticalAlignBottomOutlinedIcon from "@mui/icons-material/VerticalAlignBottomOutlined";
import VerticalAlignTopOutlinedIcon from "@mui/icons-material/VerticalAlignTopOutlined";
import PhotoSharpIcon from "@mui/icons-material/PhotoSharp";
import { HexColorPicker } from "react-colorful";
import React, { useCallback, useEffect, useState } from "react";
import { toPng, toJpeg } from "html-to-image";
import styles from "../styles/EditModal.module.scss";
import { ImageStyles, MetaDataStyles, TextStyles } from "./ShareOverlay";
import { Book } from "@/api/Interface";
import TextColorModal from "./TextColorModal";

interface EditModalProps {
  refrence: React.RefObject<HTMLDivElement>;
  book: Book;
  index: number;
  setImageStyles: (styles: ImageStyles) => void;
  setTextStyles: (styles: TextStyles) => void;
  setMetaDataStyles: (styles: MetaDataStyles) => void;
}

export type textAlignTypes = "left" | "right" | "center" | "justify";
export type verticalAlignTypes = "flex-start" | "center" | "flex-end";

const EditModal = ({
  refrence,
  book,
  index,
  setImageStyles,
  setTextStyles,
  setMetaDataStyles,
}: EditModalProps) => {
  const [color, setColor] = useState("#aabbcc");
  const [fontSize, setFontSize] = useState<number>(30);
  const [fontWeight, setFontWeight] = useState<number>(400);
  const [backgroundType, setBackgroundType] = useState<"image" | "gradient">(
    "gradient"
  );
  const [imageHeight, setImageHeight] = useState<number>(400);
  const [imageWidth, setImageWidth] = useState<number>(400);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [textWidth, setTextWidth] = useState<number>(95);
  const [textAlign, setTextAlign] = useState<textAlignTypes>("center");
  const [textVerticalAlign, setTextVerticalAlign] =
    useState<verticalAlignTypes>("center");
  const [textColor, setTextColor] = useState<string>("#000000");
  const [displayTextColorModal, setDisplayTextColorModal] =
    useState<boolean>(false);
  const [inputtedImageUrl, setInputtedImageurl] = useState<string | null>(null);

  const handleImageDownload = useCallback(async () => {
    if (refrence.current === null) {
      return;
    }

    const watermarkText = "KTON.XYZ"; // Set your watermark text here
    const watermarkStyles = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%) rotate(-45deg)", // Rotate the element by -45 degrees
      color: "black", // Adjust the color and opacity as needed
      fontSize: `${imageWidth * 0.25}px`,
      opacity: 0.1,
    };

    const watermarkElement = document.createElement("h1");
    watermarkElement.textContent = watermarkText;
    Object.assign(watermarkElement.style, watermarkStyles);

    // Append the watermark h2 element to the div
    refrence.current.appendChild(watermarkElement);

    try {
      const dataUrl = await toPng(refrence.current, { cacheBust: false });

      const link = document.createElement("a");
      link.download = `${book?.title}-${index}`;
      link.href = dataUrl;
      link.click();
      if (refrence.current) refrence.current.removeChild(watermarkElement);
    } catch (err) {
      console.log(err);
    }

    // Remove the watermark element from the div
  }, [refrence]);

  const BaseStyle = {
    width: `${imageWidth}px`,
    height: `${imageHeight}px`,
    alignItems: textVerticalAlign,
  };

  const ImageStyle =
    backgroundType === "image"
      ? {
          ...BaseStyle,
          backgroundImage: `url(${backgroundImage})`,
        }
      : {
          ...BaseStyle,
          backgroundColor: color,
        };

  const TextStyles = {
    fontWeight: fontWeight,
    fontSize: fontSize,
    width: `${textWidth}%`,
    textAlign: textAlign,
    color: textColor,
  };

  const MetaDataStyles = {
    fontWeight: fontWeight,
    fontSize: fontSize * 0.65,
    color: textColor,
  };

  //This is for sharing images natively
  const dataURLtoFile = (dataurl: any, filename: any) => {
    var arr = dataurl.split(","),
      mimeType = arr[0].match(/:(.*?);/)[1],
      decodedData = atob(arr[1]),
      lengthOfDecodedData = decodedData.length,
      u8array = new Uint8Array(lengthOfDecodedData);
    while (lengthOfDecodedData--) {
      u8array[lengthOfDecodedData] =
        decodedData.charCodeAt(lengthOfDecodedData);
    }
    return new File([u8array], filename, { type: mimeType });
  };

  const shareFile = (file: any, title: any, text: any) => {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator
        .share({
          files: [file],
          title,
          text,
        })
        .then(() => console.log("Share was successful."))
        .catch((error) => console.log("Sharing failed", error));
    } else {
      console.log(`Your system doesn't support sharing files.`);
    }
  };

  const createImage = () => {
    toJpeg(document.getElementById("ss_image")!, { quality: 0.95 }).then(
      (dataUrl: string) => {
        const file = dataURLtoFile(dataUrl, "thanku_poster.png");
        shareFile(file, "Title", "https://co-aid.in");
      }
    );
  };
  //This is for sharing images natively

  //When anything changes we want to update the styles and send to parent
  useEffect(() => {
    setImageStyles(ImageStyle);
    setTextStyles(TextStyles);
    setMetaDataStyles(MetaDataStyles);
  }, [
    color,
    fontSize,
    fontWeight,
    imageHeight,
    imageWidth,
    textAlign,
    textVerticalAlign,
    textWidth,
    textColor,
    backgroundType,
    backgroundImage,
  ]);

  return (
    <div
      className={styles.editModal}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    >
      {displayTextColorModal && (
        <TextColorModal textColor={textColor} setTextColor={setTextColor} />
      )}
      <div className={styles.header}>
        <p>Background</p>
      </div>
      <div className={styles.backgroundOptionsSection}>
        <div
          onClick={() => setBackgroundType("gradient")}
          className={`${styles.gradientBox} ${
            backgroundType === "gradient" && styles.selectedIcon
          }`}
        ></div>
        {/* <PhotoSharpIcon
          onClick={() => setBackgroundType("image")}
          className={`${styles.imageIcon} ${
            backgroundType === "image" && styles.selectedIcon
          }`}
        /> */}
      </div>
      <div className={styles.backgroundSection}>
        {backgroundType === "image" ? (
          <>
            <div className={styles.searchSection}>
              <input
                type="text"
                placeholder="Search for an image"
                onChange={(e) => setInputtedImageurl(e.target.value)}
              />
            </div>
            <div className={styles.buttonSection}>
              <p
                className={styles.button}
                onClick={() => {
                  if (inputtedImageUrl) {
                    setBackgroundImage(inputtedImageUrl);
                  }
                }}
              >
                Save
              </p>
            </div>
          </>
        ) : (
          <HexColorPicker
            color={color}
            onChange={setColor}
            id={styles.colorPicker}
          />
        )}
      </div>
      <div className={styles.header}>
        <p>Text</p>
      </div>
      <div className={styles.textSection}>
        <div className={styles.textSectionRow}>
          <div className={styles.textInputContainer}>
            <p>Weight</p>
            <input
              type="number"
              value={fontWeight}
              step={100}
              min={100}
              max={900}
              onChange={(e) => setFontWeight(Number(e.target.value))}
            />
          </div>
          <div className={styles.textInputContainer}>
            <p>Size</p>
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              min={1}
            />
          </div>
        </div>
        <div className={styles.textSectionRow}>
          <div className={styles.textInputContainer}>
            <p>Width</p>
            <input
              type="number"
              value={textWidth}
              min={0}
              max={100}
              onChange={(e) => setTextWidth(Number(e.target.value))}
            />
          </div>
          <div className={styles.textInputContainer}>
            <p>Color</p>
            <div
              className={styles.colorBox}
              style={{ backgroundColor: textColor }}
              onClick={() => setDisplayTextColorModal(!displayTextColorModal)}
            ></div>
          </div>
        </div>
        <div className={styles.textSectionRow}>
          <div className={styles.textInputIconContainer}>
            <FormatAlignLeftOutlinedIcon
              className={`${styles.alignIcon} ${
                textAlign === "left" && styles.selectedIcon
              }`}
              onClick={() => setTextAlign("left")}
            />
            <FormatAlignRightOutlinedIcon
              className={`${styles.alignIcon} ${
                textAlign === "right" && styles.selectedIcon
              }`}
              onClick={() => setTextAlign("right")}
            />
            <FormatAlignCenterOutlinedIcon
              className={`${styles.alignIcon} ${
                textAlign === "center" && styles.selectedIcon
              }`}
              onClick={() => setTextAlign("center")}
            />
            <FormatAlignJustifyOutlinedIcon
              className={`${styles.alignIcon} ${
                textAlign === "justify" && styles.selectedIcon
              }`}
              onClick={() => setTextAlign("justify")}
            />
          </div>
          <div className={styles.textInputIconContainer}>
            <VerticalAlignTopOutlinedIcon
              className={`${styles.alignIcon} ${
                textVerticalAlign === "flex-start" && styles.selectedIcon
              }`}
              onClick={() => setTextVerticalAlign("flex-start")}
            />
            <VerticalAlignCenterOutlinedIcon
              className={`${styles.alignIcon} ${
                textVerticalAlign === "center" && styles.selectedIcon
              }`}
              onClick={() => setTextVerticalAlign("center")}
            />
            <VerticalAlignBottomOutlinedIcon
              className={`${styles.alignIcon} ${
                textVerticalAlign === "flex-end" && styles.selectedIcon
              }`}
              onClick={() => setTextVerticalAlign("flex-end")}
            />
          </div>
        </div>
      </div>
      <div className={styles.header}>
        <p>Image Size</p>
      </div>
      <div className={styles.imageSizeSection}>
        <div className={styles.imageSizeInputContainer}>
          <p>X</p>
          <input
            type="number"
            value={imageWidth}
            onChange={(e) => setImageWidth(Number(e.target.value))}
          />
        </div>
        <div className={styles.imageSizeInputContainer}>
          <p>Y</p>
          <input
            type="number"
            value={imageHeight}
            onChange={(e) => setImageHeight(Number(e.target.value))}
          />
        </div>
      </div>
      <div className={styles.header}>
        <p>Export Image</p>
      </div>
      <div className={styles.exportSection}>
        <p
          className={styles.exportButton}
          onClick={() => handleImageDownload()}
        >
          Export as .png
        </p>
        <p
          className={styles.exportButton}
          onClick={async () => {
            try {
              createImage();
            } catch (err) {
              navigator.clipboard.writeText(window.location.href);
            }
          }}
        >
          Share
        </p>
      </div>
    </div>
  );
};

export default EditModal;
