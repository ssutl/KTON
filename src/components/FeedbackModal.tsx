//Create a react component called FeedbackModal
import styles from "../styles/FeedbackModal.module.scss";
import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import CloseIcon from "@mui/icons-material/Close";
import SentimentDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentDissatisfiedOutlined";
import SentimentNeutralOutlinedIcon from "@mui/icons-material/SentimentNeutralOutlined";
import SentimentVerySatisfiedOutlinedIcon from "@mui/icons-material/SentimentVerySatisfiedOutlined";
import userFeedbackApi from "@/api/Users/UserFeedback";
//Want to take the state changer as a prop
export interface FeedbackModalProps {
  closeModal: () => void;
}
const FeedbackModal = ({ closeModal }: FeedbackModalProps) => {
  const [feedbackInput, setFeedbackInput] = useState("");
  const [feedbackMood, setFeedbackMood] = useState<
    "Sad" | "Neutral" | "Happy" | undefined
  >(undefined);
  const feedbackUser = localStorage.getItem("user");

  const handleSendFeedback = async () => {
    if (feedbackMood && feedbackInput) {
      const response = await userFeedbackApi({
        user: feedbackUser === null ? "unknown" : feedbackUser,
        satisfaction: feedbackMood,
        text: feedbackInput,
        category: "General",
      });

      if (response === "Feedback sent") {
        alert("Thanks for the feedback!");
        closeModal();
      }
    } else {
      alert("Please select a satisfaction face thing and leave some feedback");
    }
  };

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
            onClick={() => setFeedbackMood("Sad")}
            className={`${styles.faceIcon} ${
              feedbackMood === "Sad" && styles.selectedFace
            }`}
          />
          <SentimentNeutralOutlinedIcon
            onClick={() => setFeedbackMood("Neutral")}
            className={`${styles.faceIcon} ${
              feedbackMood === "Neutral" && styles.selectedFace
            }`}
          />
          <SentimentVerySatisfiedOutlinedIcon
            onClick={() => setFeedbackMood("Happy")}
            className={`${styles.faceIcon} ${
              feedbackMood === "Happy" && styles.selectedFace
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
        <div
          className={styles.feedbackModalFooter}
          onClick={() => handleSendFeedback()}
        >
          <p>Send</p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
