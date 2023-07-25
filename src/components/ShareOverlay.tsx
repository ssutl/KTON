import { toPng } from "html-to-image";
import React, { useRef, useCallback, useState } from "react";
import styles from "../styles/ShareOverlay.module.scss";
import PhotoSharpIcon from "@mui/icons-material/PhotoSharp";
import { HexColorPicker } from "react-colorful";
import FormatAlignLeftOutlinedIcon from "@mui/icons-material/FormatAlignLeftOutlined";
import FormatAlignRightOutlinedIcon from "@mui/icons-material/FormatAlignRightOutlined";
import FormatAlignCenterOutlinedIcon from "@mui/icons-material/FormatAlignCenterOutlined";
import FormatAlignJustifyOutlinedIcon from "@mui/icons-material/FormatAlignJustifyOutlined";
import VerticalAlignCenterOutlinedIcon from "@mui/icons-material/VerticalAlignCenterOutlined";
import VerticalAlignBottomOutlinedIcon from "@mui/icons-material/VerticalAlignBottomOutlined";
import VerticalAlignTopOutlinedIcon from "@mui/icons-material/VerticalAlignTopOutlined";

export interface ShareOverlayProps {
  closeModal: () => void;
  highlightText: string;
}

const ShareOverlay = ({ closeModal, highlightText }: ShareOverlayProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState("#aabbcc");
  const [text, setText] = useState(highlightText);
  const [fontSize, setFontSize] = useState<number>(30);
  const [fontWeight, setFontWeight] = useState<number>(400);
  const [backgroundType, setBackgroundType] = useState<"image" | "gradient">(
    "gradient"
  );
  const [imageHeight, setImageHeight] = useState<number>(400);
  const [imageWidth, setImageWidth] = useState<number>(400);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [textWidth, setTextWidth] = useState<number>(95);
  const [textAlign, setTextAlign] = useState<
    "left" | "right" | "center" | "justify"
  >("center");
  const [textVerticalAlign, setTextVerticalAlign] = useState<
    "flex-start" | "center" | "flex-end"
  >("center");

  const handleImageDownload = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    const watermarkText = "KTON"; // Set your watermark text here
    const watermarkStyles = {
      position: "absolute",
      bottom: "10px",
      right: "10px",
      color: "black", // Adjust the color and opacity as needed
      fontSize: "20px",
    };

    const watermarkElement = document.createElement("h2");
    watermarkElement.textContent = watermarkText;
    Object.assign(watermarkElement.style, watermarkStyles);

    // Append the watermark h2 element to the div
    ref.current.appendChild(watermarkElement);

    toPng(ref.current, { cacheBust: false })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "my-image-name.png";
        link.href = dataUrl;
        console.log(dataUrl);
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref]);

  const ImageStyles = {
    width: `${imageWidth}px`,
    height: `${imageHeight}px`,
    alignItems: textVerticalAlign,
  };

  const componentStyle =
    backgroundType === "image"
      ? {
          ...ImageStyles,
          backgroundImage: `url(${backgroundImage})`,
        }
      : {
          ...ImageStyles,
          backgroundColor: color,
        };

  return (
    <div className={styles.shareOverlay} onMouseDown={() => closeModal()}>
      <div
        className={styles.highlightImage}
        onMouseDown={(e) => {
          e.stopPropagation();
          handleImageDownload();
        }}
        ref={ref}
        style={componentStyle}
      >
        <h1
          style={{
            fontWeight: fontWeight,
            fontSize: fontSize,
            width: `${textWidth}%`,
            textAlign: textAlign,
          }}
        >
          {text}
        </h1>
      </div>
      <div
        className={styles.editModal}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={styles.header}>
          <p>Background</p>
        </div>
        <div className={styles.backgroundOptionsSection}>
          <div
            id={styles.gradientBox}
            onClick={() => setBackgroundType("gradient")}
            className={`${
              backgroundType === "gradient" && styles.selectedIcon
            }`}
          ></div>
          <PhotoSharpIcon
            id={styles.imageIcon}
            onClick={() => setBackgroundType("image")}
            className={`${backgroundType === "image" && styles.selectedIcon}`}
          />
        </div>
        <div className={styles.backgroundSection}>
          {backgroundType === "image" ? (
            <h1>Input for images</h1>
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
      </div>
    </div>
  );
};

export default ShareOverlay;
