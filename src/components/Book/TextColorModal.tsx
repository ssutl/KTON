import styles from "../../styles/Components/TextColorModal.module.scss";
import { HexColorPicker } from "react-colorful";

interface TextColorModalProps {
  textColor: string;
  setTextColor: React.Dispatch<React.SetStateAction<string>>;
  closeModal: () => void;
}

//Modal for changing the text color, within edit modal. Pass text colour back up to edit modal.
const TextColorModal = ({
  textColor,
  setTextColor,
  closeModal,
}: TextColorModalProps) => {
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
      <div className={styles.overlay} onClick={() => closeModal()}></div>
    </>
  );
};

export default TextColorModal;
