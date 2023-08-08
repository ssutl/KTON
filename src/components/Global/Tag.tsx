import React, { useState, useEffect } from "react";
import styles from "../styles/Tag.module.scss";

interface TagProps {
  name: string;
}

const Tag = ({ name }: TagProps) => {
  return (
    <p
      className={styles.Tag}
      onClick={() => window.open("https://www.instagram.com/ss.utl/")}
    >
      {name}
    </p>
  );
};

export default Tag;
