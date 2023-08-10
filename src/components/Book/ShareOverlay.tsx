import React, { useRef, useState, useContext } from "react";
import styles from "../../styles/Components/ShareOverlay.module.scss";
import { useRouter } from "next/router";
import { KTON_CONTEXT } from "../../context/KTONContext";
import cleanAuthor from "@/helpers/cleanAuthor";
import EditModal from "./EditModal";

export interface ShareOverlayProps {
  closeModal: () => void;
  highlightText: string;
  index: number;
}

export interface ImageStyles {
  backgroundImage?: string;
  backgroundColor?: string;
  width: string;
  height: string;
  alignItems: "flex-start" | "center" | "flex-end";
}

export interface TextStyles {
  fontWeight: number;
  fontSize: number;
  width: string;
  textAlign: "center" | "left" | "right" | "justify";
  color: string;
}

export interface MetaDataStyles {
  fontWeight: number;
  fontSize: number;
  color: string;
}

//Grabbing the close modal function from the parent component, and the highlight text
const ShareOverlay = ({
  closeModal,
  highlightText,
  index,
}: ShareOverlayProps) => {
  const { books } = useContext(KTON_CONTEXT);
  const router = useRouter();
  const book_id = router.query.id;
  const book = books?.find((book) => book._id === book_id);
  //Refrence of the image to be used in the edit modal
  const ref = useRef<HTMLDivElement>(null);
  //Styling for the image which is passed up from the edit modal
  const [ImageStyles, setImageStyles] = useState<ImageStyles>();
  const [TextStyles, setTextStyles] = useState<TextStyles>();
  const [MetaDataStyles, setMetaDataStyles] = useState<MetaDataStyles>();

  if (!book) return null;

  return (
    <div className={styles.shareOverlay} onMouseDown={() => closeModal()}>
      <div className={styles.ImageSection}>
        <div
          className={styles.highlightImage}
          id="ss_image"
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          ref={ref}
          style={ImageStyles}
          contentEditable="true"
        >
          <h1 style={TextStyles}>&quot;{highlightText}&quot;</h1>
          <div className={styles.imageMetaData}>
            <p style={MetaDataStyles}>{book.title}</p>
            <p style={MetaDataStyles}>{cleanAuthor(book.author)}</p>
          </div>
        </div>
      </div>
      <EditModal
        refrence={ref}
        book={book}
        index={index}
        setImageStyles={(value) => setImageStyles(value)}
        setTextStyles={(value) => setTextStyles(value)}
        setMetaDataStyles={(value) => setMetaDataStyles(value)}
      />
    </div>
  );
};

export default ShareOverlay;