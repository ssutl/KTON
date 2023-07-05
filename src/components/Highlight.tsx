import styles from "../styles/Highlight.module.scss";
import React, { useEffect, useState } from "react";
import { Book_highlight } from "@/api/Interface";
import userAuthenticated from "@/helpers/UserAuthenticated";

interface highlightProps {
  highlight: Book_highlight;
  index: number;
}

const Highlight = ({ highlight, index }: highlightProps) => {
  const [restrictions, setRestrictions] = useState(true);

  useEffect(() => {
    setRestrictions(!userAuthenticated());
  }, []);

  const loginModal = () => {
    alert("login modal");
  };

  return (
    <div className={styles.Highlight}>
      <div className={styles.mainHalf}>
        <h2>{highlight.Text}</h2>
        {restrictions ? null : <h3>{highlight.notes}</h3>}
        <div className={styles.highlightOptions}>
          <p onClick={() => (restrictions ? loginModal() : null)}>Annotate</p>
          <p onClick={() => (restrictions ? loginModal() : null)}>Tag</p>
          <p onClick={() => (restrictions ? loginModal() : null)}>Star</p>
          <p onClick={() => (restrictions ? loginModal() : null)}>Share</p>
          <p onClick={() => (restrictions ? loginModal() : null)}>Delete</p>
        </div>
      </div>
      <div className={styles.metaHalf}>
        <p>{new Date(highlight.Date).toDateString()}</p>
      </div>
    </div>
  );
};
export default Highlight;
