import React, { useState, useEffect } from "react";
import styles from "../styles/Tag.module.scss";

interface TagProps {
  name: string;
}

const Tag = ({ name }: TagProps) => {
  return <div className={styles.Tag}>{name}</div>;
};

export default Tag;
