import styles from "../styles/TextColorModal.module.scss";
import { HexColorPicker } from "react-colorful";

interface TextColorModalProps {
  textColor: string;
  setTextColor: React.Dispatch<React.SetStateAction<string>>;
}

const TextColorModal = ({ textColor, setTextColor }: TextColorModalProps) => {
  return (
    <>
      <div
        className={styles.pickerContainer}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      >
        <HexColorPicker color={textColor} onChange={setTextColor} />
      </div>
      <div className={styles.overlay}></div>
    </>
  );
};

export default TextColorModal;
