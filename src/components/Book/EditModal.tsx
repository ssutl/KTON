import FormatAlignLeftOutlinedIcon from "@mui/icons-material/FormatAlignLeftOutlined";
import FormatAlignRightOutlinedIcon from "@mui/icons-material/FormatAlignRightOutlined";
import FormatAlignCenterOutlinedIcon from "@mui/icons-material/FormatAlignCenterOutlined";
import FormatAlignJustifyOutlinedIcon from "@mui/icons-material/FormatAlignJustifyOutlined";
import VerticalAlignCenterOutlinedIcon from "@mui/icons-material/VerticalAlignCenterOutlined";
import VerticalAlignBottomOutlinedIcon from "@mui/icons-material/VerticalAlignBottomOutlined";
import VerticalAlignTopOutlinedIcon from "@mui/icons-material/VerticalAlignTopOutlined";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import CropPortraitIcon from "@mui/icons-material/CropPortrait";
import { HexColorPicker } from "react-colorful";
import React, { useCallback, useEffect, useState } from "react";
import styles from "../../styles/Components/EditModal.module.scss";
import { ImageStyles, MetaDataStyles, TextStyles } from "./ShareOverlay";
import { Book } from "@/api/Interface";
import TextColorModal from "./TextColorModal";
import ShareImageNatively from "@/helpers/ShareImageNatively";
import ImageDownload from "@/helpers/ImageDownload";
import { set } from "lodash";

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
  const [screenWidth, setScreenWidth] = useState<number | undefined>(undefined);

  //Collecting props to edit the picture, such as text color, font size, etc.
  const [color, setColor] = useState("#aabbcc");
  const [fontSize, setFontSize] = useState<number>(30);
  const [fontWeight, setFontWeight] = useState<number>(400);
  const [backgroundType, setBackgroundType] = useState<"image" | "gradient">(
    "gradient"
  );
  const [imageHeight, setImageHeight] = useState<number>(400);
  const [imageWidth, setImageWidth] = useState<number>(400);
  const [textWidth, setTextWidth] = useState<number>(95);
  const [textAlign, setTextAlign] = useState<textAlignTypes>("center");
  const [selectedCrop, setSelectedCrop] = useState<"portrait" | "square">(
    "square"
  );
  const [textVerticalAlign, setTextVerticalAlign] =
    useState<verticalAlignTypes>("center");
  const [textColor, setTextColor] = useState<string>("#000000");
  const [displayTextColorModal, setDisplayTextColorModal] =
    useState<boolean>(false);
  //Collecting props to edit the picture, such as text color, font size, etc.

  //This is to download the image to users device
  const { handleImageDownload } = ImageDownload({
    refrence,
    title: `${book.title}-${index}.png`,
    imageWidth,
  });

  //Styles to pass up to parent image and render
  const ImageStyle = {
    width: `${imageWidth}px`,
    height: `${imageHeight}px`,
    alignItems: textVerticalAlign,
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
  ]);

  useEffect(() => {
    //Have to set screenwidth to disable share feature for mobile
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", () => handleResize());

    //Setting the image size for mobile
    if (window.innerWidth < 1024) {
      setImageWidth(320);
      setImageHeight(320);
      setFontSize(20);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
      {
        //Section to edit the background colour of the image
      }
      <div className={styles.header}>
        <p>Background</p>
      </div>
      <div className={styles.backgroundOptionsSection}>
        <div className={styles.gradientBox}></div>
      </div>
      <div className={styles.backgroundSection}>
        <HexColorPicker
          color={color}
          onChange={setColor}
          id={styles.colorPicker}
        />
      </div>
      {
        //Section to edit the text of the image
      }
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
      {
        //Section to edit the size of the image
      }
      <div className={styles.header}>
        <p>Image Size</p>
      </div>
      <div className={styles.textSection}>
        <div className={`${styles.textSectionRow} ${styles.laptop}`}>
          <div className={styles.textInputContainer}>
            <p>X</p>
            <input
              type="number"
              value={imageWidth}
              onChange={(e) => setImageWidth(Number(e.target.value))}
            />
          </div>
          <div className={styles.textInputContainer}>
            <p>Y</p>
            <input
              type="number"
              value={imageHeight}
              onChange={(e) => setImageHeight(Number(e.target.value))}
            />
          </div>
        </div>
        <div className={`${styles.textSectionRow} ${styles.mobile}`}>
          <div className={styles.textInputIconContainer}>
            <p>Crop</p>
            <CropPortraitIcon
              className={`${styles.cropIcon} ${
                selectedCrop === "portrait" && styles.selectedIcon
              }`}
              onClick={() => {
                setSelectedCrop("portrait");
                //has to be 4:5 ratio
                setImageHeight(400);
                setImageWidth(320);
              }}
            />
            <CropSquareIcon
              className={`${styles.cropIcon} ${
                selectedCrop === "square" && styles.selectedIcon
              }`}
              onClick={() => {
                setSelectedCrop("square");
                //has to be 1:1 ratio
                setImageHeight(320);
                setImageWidth(320);
              }}
            />
          </div>
        </div>
      </div>
      {
        //Section to export image
      }
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
              ShareImageNatively(`${book?.title}-${index}.jpeg`);
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
