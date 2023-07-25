//Create a react component called FeedbackModal
import styles from "../styles/FeedbackModal.module.scss";
import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import CloseIcon from "@mui/icons-material/Close";
import SentimentDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentDissatisfiedOutlined";
import SentimentNeutralOutlinedIcon from "@mui/icons-material/SentimentNeutralOutlined";
import SentimentVerySatisfiedOutlinedIcon from "@mui/icons-material/SentimentVerySatisfiedOutlined";
//Want to take the state changer as a prop
export interface FeedbackModalProps {
  closeModal: () => void;
}
const FeedbackModal = ({ closeModal }: FeedbackModalProps) => {
  const [feedbackInput, setFeedbackInput] = useState("");
  const [feedbackMood, setFeedbackMood] = useState<
    "sad" | "neutral" | "happy" | undefined
  >(undefined);
  const feedbackUser = localStorage.getItem("user");

  return (
    <div className={styles.pageOverlay} onMouseDown={() => closeModal()}>
      <div
        className={styles.feedbackModal}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.feedbackModalHeader}>
          <p>Leave some feedback</p>
          <CloseIcon onClick={() => closeModal()} id={styles.closeIcon} />
        </div>
        <div className={styles.feedbackModalFaces}>
          <SentimentDissatisfiedOutlinedIcon
            onClick={() => setFeedbackMood("sad")}
            className={`${styles.faceIcon} ${
              feedbackMood === "sad" && styles.selectedFace
            }`}
          />
          <SentimentNeutralOutlinedIcon
            onClick={() => setFeedbackMood("neutral")}
            className={`${styles.faceIcon} ${
              feedbackMood === "neutral" && styles.selectedFace
            }`}
          />
          <SentimentVerySatisfiedOutlinedIcon
            onClick={() => setFeedbackMood("happy")}
            className={`${styles.faceIcon} ${
              feedbackMood === "happy" && styles.selectedFace
            }`}
          />
        </div>
        <div className={styles.feedbackModalBody}>
          <TextareaAutosize
            placeholder="How can we improve?"
            className={styles.feedbackModalInput}
            onChange={(e) => setFeedbackInput(e.target.value)}
          />
        </div>
        <div className={styles.feedbackModalFooter}>
          <p>Send</p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
